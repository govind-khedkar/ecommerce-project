import { AppDataSource } from "../data-source";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { Product } from "../entity/Products";
import { User } from "../entity/User";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const userRepo = AppDataSource.getRepository(User);
const orderRepo = AppDataSource.getRepository(Order);
const productRepo = AppDataSource.getRepository(Product);
const orderItemRepo = AppDataSource.getRepository(OrderItem);

export const checkout = async (req: any, res: any) => {
    const userId = req.user.userId;
    const { PaymentMethod } = req.body;

    if (!["COD", "CARD", "UPI"].includes(PaymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
    }

    const user = await userRepo.findOne({ where: { id: userId } });

    const cart = await cartRepo.findOne({ where: { user: { id: userId } } });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await cartItemRepo.find({
        where: {
            cart: { id: cart.id },
        },
        relations: ["product"]
    });

    if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    for (const item of cartItems) {
        totalAmount += item.product.price * item.quantity;
    }

    const order = orderRepo.create({
        user,
        totalAmount,
        PaymentMethod
    });
    await orderRepo.save(order);

    for (const item of cartItems) {
        const product = item.product;

        if (product.stock < item.quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        product.stock -= item.quantity;
        await productRepo.save(product)

        const orderItem = orderItemRepo.create({
            order,
            product,
            quantity: item.quantity,
            priceAtTime: product.price
        });

        await orderItemRepo.save(orderItem);
    }

    await cartItemRepo.remove(cartItems);

    return res.status(200).json({
        message: "Order placed successfully",
        data: {
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentMethod: order.PaymentMethod,
            items: cartItems.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            }))
        }
    });

}

export const getOrders = async (req: any, res: any) => {
    const userId = req.user.userId;
    const user = await userRepo.findOne({ where: { id: userId } });

    const orders = await orderRepo.find({ where: { user: { id: userId } }, order: { id: "DESC" } });

    return res.status(200).json({ message: "order details fetched", data: { orders } });
}

export const getOrderDetails = async (req: any, res: any) => {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order id" });
    }
    const userId = req.user.userId;

    const order = await orderRepo.findOne({
        where: {
            id: orderId,
            user: { id: userId }
        },
    });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const itemsWithoutImage = await orderItemRepo.find({
        where: { order: { id: orderId } },
        relations: ["product"]
    });

    const items = itemsWithoutImage.map((item: any) => ({
        ...item,
        product: {
            ...item.product,
            imageUrl: item.product.imagePath
                ? `http://localhost:3000/images/${item.product.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }
    }))

    return res.status(200).json({
        message: "Order details fetched",
        data: {
            id: order.id,
            totalAmount: order.totalAmount,
            paymentMethod: order.PaymentMethod,
            createdAt: order.createdAt,
            status: order.status,
            items
        }
    });
}


export const getAllOrders = async (req: any, res: any) => {
    const orders = await orderRepo.find({
        order: { createdAt: "DESC" },
        relations: ["user"]
    });

    if (!orders) {
        return res.status(404).json({ message: "Order not found" });
    }

    const safeOrders = orders.map((order: any) => ({
        ...order,
        user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
            role: order.user.role
        }
    }));

    return res.status(200).json({ message: "ALL orders fetched", data: safeOrders });
}


export const updateOrderStatus = async (req: any, res: any) => {
    const { status } = req.body;
    const orderId = Number(req.params.id);

    if (!status) {
        return res.status(400).json({ message: "Missing fields" });
    }

    if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order id" });
    }

    const validStatus = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const order = await orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await orderRepo.save(order);

    return res.status(200).json({ message: "Order status updated" });
}

