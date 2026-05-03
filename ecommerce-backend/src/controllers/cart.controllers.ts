import { AppDataSource } from "../data-source";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Product } from "../entity/Products";
import { User } from "../entity/User";

const productRepo = AppDataSource.getRepository(Product);
const cartRepo = AppDataSource.getRepository(Cart);
const userRepo = AppDataSource.getRepository(User);
const cartItemRepo = AppDataSource.getRepository(CartItem);

export const addToCart = async (req: any, res: any) => {
    const { productId, quantity } = req.body;


    if (!productId || !quantity) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const userId = req.user.userId;
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    let cart = await cartRepo.findOne({
        where: { user: { id: userId } }
    });

    if (!cart) {
        cart = cartRepo.create({ user });
        await cartRepo.save(cart);
    }


    const product = await productRepo.findOne({ where: { id: productId } });

    if (!product) return res.status(404).json({ message: "Product not found" });


    let cartItem = await cartItemRepo.findOne({
        where: {
            cart: { id: cart.id },
            product: { id: productId }
        }
    })

    const totalQty = cartItem ? cartItem.quantity + quantity : quantity;

    if (product.stock < totalQty) {
        return res.status(400).json({ message: "Not enough stock" });
    }
    if (cartItem) {
        cartItem.quantity += quantity
    }
    else {
        cartItem = cartItemRepo.create({
            cart: cart as any,
            product: product as any,
            quantity
        });
    }
    await cartItemRepo.save(cartItem);

    return res.status(200).json({ message: "Product added to cart" });
}

export const getCart = async (req: any, res: any) => {
    const userId = req.user.userId;

    const cart = await cartRepo.findOne({
        where: { user: { id: userId } }
    });


    if (!cart) {
        return res.status(200).json({ message: "Cart fetched", data: [] });
    }
    const cartItems = await cartItemRepo.find({
        where: {
            cart: { id: cart.id }
        }, relations: ["product"]
    })

    const itemWithImage = cartItems.map((item: any) => ({
        ...item,
        product: {
            ...item.product,
            imageUrl: item.product.imagePath
                ? `http://localhost:3000/images/${item.product.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }
    }))

    return res.status(200).json({
        message: "Cart fetched",
        data: { itemWithImage }
    });
}

export const updateCartItem = async (req: any, res: any) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const userId = req.user.userId;
    const cart = await cartRepo.findOne({
        where: { user: { id: userId } }
    });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }


    const cartItem = await cartItemRepo.findOne({
        where: {
            cart: { id: cart.id },
            product: { id: productId }
        },
        relations: ["product"]
    });

    if (!cartItem) {
        return res.status(404).json({ message: "Item not in cart" });
    }

    if (cartItem.product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
    }

    cartItem.quantity = quantity;
    await cartItemRepo.save(cartItem);

    return res.status(200).json({ message: "Cart updated" });
}

export const removeItem = async (req: any, res: any) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const userId = req.user.userId;
    const cart = await cartRepo.findOne({
        where: { user: { id: userId } }
    });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }


    const cartItem = await cartItemRepo.findOne({
        where: {
            cart: { id: cart.id },
            product: { id: productId }
        },
        relations: ["product"]
    });

    if (!cartItem) {
        return res.status(404).json({ message: "Item not in cart" });
    }

    await cartItemRepo.delete(cartItem.id);

    return res.status(200).json({ message: "Item removed from cart" });
}
