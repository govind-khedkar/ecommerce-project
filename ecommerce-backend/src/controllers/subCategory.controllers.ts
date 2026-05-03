import { AppDataSource } from "../data-source"
import { Category } from "../entity/Category";
import { SubCategory } from "../entity/SubCategory"

const subCategoryRepo = AppDataSource.getRepository(SubCategory);
const categoryRepo = AppDataSource.getRepository(Category);

export const adddSubCategory = async (req: any, res: any) => {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const category = await categoryRepo.findOne({ where: { id: categoryId } });

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = subCategoryRepo.create({
        name,
        category: category as any
    })

    await subCategoryRepo.save(subCategory);
    res.status(201).json({ message: "SubCategory added successfully" });

}


export const getSubcategories = async (req: any, res: any) => {
    const subCategories = await subCategoryRepo.find();

    res.status(201).json({ message: "SubCategories fetched", data: subCategories });

}

export const getByCategory = async (req: any, res: any) => {
    const categoryId = Number(req.params.categoryId);
    const subCategories = await subCategoryRepo.find({ 
        where: { category: { id: categoryId } },
        relations: ["category"]
    });
    return res.status(200).json({ data: subCategories });
}