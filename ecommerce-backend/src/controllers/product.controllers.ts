import { AppDataSource } from "../data-source"
import { Product } from "../entity/Products"
import { SubCategory } from "../entity/SubCategory";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

const subCategoryRepo = AppDataSource.getRepository(SubCategory);
const productRepo = AppDataSource.getRepository(Product);

export const addProduct = async (req: any, res: any) => {
    const { name, description, price, stock, subCategoryId } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    if (!name || !price || !stock || !subCategoryId) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const subCategory = await subCategoryRepo.findOne({ where: { id: subCategoryId } });
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    const product = productRepo.create({
        name,
        description,
        price,
        stock,
        imagePath,
        subCategory: subCategory as any
    });

    await productRepo.save(product);

    res.status(201).json({ message: "Product added successfully" });
}

export const getProductById = async (req: any, res: any) => {
    const productId = Number(req.params.id);
    const product = await productRepo.findOne({
        where: { id: productId },
        relations: ["subCategory", "subCategory.category", "subCategory.category.type"]
    });

    if (!product) {
        return res.status(404).json({ message: "No product found" });
    }

    const productWithImage = {
        ...product,
        imageUrl: product.imagePath
            ? `http://localhost:3000/images/${product.imagePath}`
            : `http://localhost:3000/images/default.jpg`
    }

    return res.status(200).json({
        message: "Product fetched",
        data: productWithImage
    });
}

export const searchProducts = async (req: any, res: any) => {
    const keyword = req.query.keyword as string;
    const products = await productRepo.find({
        where: [
            { name: Like(`%${keyword}%`) },
            { description: Like(`%${keyword}%`) }
        ], relations: ["subCategory"]
    });

    if (!products) {
        return res.status(404).json({ message: "No product found" })
    }

    const productsWithImage = products.map((p: any) => {
        return {
            ...p,
            imageUrl: p.imagePath
                ? `http://localhost:3000/images/${p.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }
    })

    return res.status(200).json({
        message: "Product fetched",
        data: productsWithImage
    });
}

export const getBySubCategory = async (req: any, res: any) => {
    const id = Number(req.params.id);

    const products = await productRepo.find({ where: { subCategory: { id } }, relations: ["subCategory"] })
    if (!products) {
        return res.status(404).json({ message: "No product found" })
    }

    const productsWithImage = products.map((p: any) => {
        return {
            ...p,
            imageUrl: p.imagePath
                ? `http://localhost:3000/images/${p.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }
    })

    return res.status(200).json({
        message: "Product fetched",
        data: productsWithImage
    });

}

export const filterByPrice = async (req: any, res: any) => {
    const min = req.query.min as number;
    const max = req.query.max as number;

    const products = await productRepo.find({
        where: [
            { price: Between(min, max) }
        ], relations: ["subCategory"]
    });

    if (!products) {
        return res.status(404).json({ message: "No product found" })
    }

    const productsWithImage = products.map((p: any) => {
        return {
            ...p,
            imageUrl: p.imagePath
                ? `http://localhost:3000/images/${p.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }
    })

    return res.status(200).json({
        message: "Product fetched",
        data: productsWithImage
    });

}

export const filteredProducts = async (req: any, res: any) => {
    const keyword = req.query.keyword as string;
    const min = req.query.min as number;
    const max = req.query.max as number;
    const subCategoryId = req.query.subCategoryId as number;
    const categoryId = req.query.categoryId as number;
    const typeId = req.query.typeId as number;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    if (!keyword && !min && !max && !subCategoryId && !categoryId && !typeId) {
        const [products, total] = await productRepo.findAndCount({ skip, take: limit, order: { id: "ASC" }, relations: ["subCategory", "subCategory.category", "subCategory.category.type"] });
        const productsWithImage = products.map((p: any) => ({
            ...p,
            imageUrl: p.imagePath
                ? `http://localhost:3000/images/${p.imagePath}`
                : `http://localhost:3000/images/default.jpg`
        }));

        return res.status(200).json({
            message: "Products fetched",
            data: { products: productsWithImage, total, page, limit }
        });
    }

    let baseWhere: any = {};

    if (!isNaN(min) && !isNaN(max)) {
        baseWhere.price = Between(min, max);
    } else if (!isNaN(min)) {
        baseWhere.price = MoreThanOrEqual(min);
    } else if (!isNaN(max)) {
        baseWhere.price = LessThanOrEqual(max);
    }

    if (!isNaN(subCategoryId)) {
        baseWhere.subCategory = { id: subCategoryId };
    } else if (!isNaN(categoryId)) {
        baseWhere.subCategory = { category: { id: categoryId } };
    } else if (!isNaN(typeId)) {
        baseWhere.subCategory = { category: { type: { id: typeId } } };
    }

    let where: any = baseWhere;

    if (keyword) {
        where = [
            { ...baseWhere, name: Like(`%${keyword}%`) },
            { ...baseWhere, description: Like(`%${keyword}%`) }
        ];
    }

    const [products, total] = await productRepo.findAndCount({
        where,
        skip,
        take: limit,
        order: { id: "ASC" },
        relations: ["subCategory", "subCategory.category", "subCategory.category.type"]
    });

    const productsWithImage = products.map((p: any) => ({
        ...p,
        imageUrl: p.imagePath
            ? `http://localhost:3000/images/${p.imagePath}`
            : `http://localhost:3000/images/default.jpg`
    }));

    return res.status(200).json({
        message: "Products fetched",
        data: {
            products: productsWithImage,
            total: total,
            page: page,
            limit: limit
        }
    });

}

export const updateProduct = async (req: any, res: any) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const productId = Number(req.params.id);
    const { name, description, price, stock } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).json({ message: "Missing fields" });
    }

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Prdouct not found" });

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;

    if (req.file) {
        product.imagePath = req.file.filename;
    }

    await productRepo.save(product);

    return res.status(200).json({ message: "Product updated successfully" });
}


export const deleteProduct = async (req: any, res: any) => {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Prdouct not found" });

    await productRepo.remove(product);

    return res.status(200).json({ message: "Product deleted successfully" });
}

