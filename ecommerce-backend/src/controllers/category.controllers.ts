import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { Type } from "../entity/Type";

const categoryRepo = AppDataSource.getRepository(Category);
const typeRepo = AppDataSource.getRepository(Type);
export const addCategory = async (req: any, res: any) => {
    const { name, typeId } = req.body;

    if (!name || !typeId) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const type = await typeRepo.findOne({ where: { id: typeId } });

    if (!type) {
        return res.status(404).json({ message: "Type not found" });
    }

    const category = categoryRepo.create({
        name,
        type: type as any
    })

    await categoryRepo.save(category);

    res.status(201).json({ message: "Category added successfully" });

}

export const getCategories = async (req: any, res: any) => {
    const categories = await categoryRepo.find({ relations: ["type"] });
    return res.status(200).json({ data: categories });
}

export const getByType = async (req: any, res: any) => {
    const typeId = Number(req.params.typeId);
    const categories = await categoryRepo.find({ 
        where: { type: { id: typeId } },
        relations: ["type"]
    });
    return res.status(200).json({ data: categories });
}

