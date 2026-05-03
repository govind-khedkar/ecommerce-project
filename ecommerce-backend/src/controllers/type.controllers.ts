import { AppDataSource } from "../data-source";
import { Type } from "../entity/Type";

const typeRepo = AppDataSource.getRepository(Type);
export const addType = async (req: any, res: any) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const type = typeRepo.create({
        name
    });

    await typeRepo.save(type);

    res.status(201).json({ message: "Type added successfully" });

}

export const getTypes = async (req: any, res: any) => {
    const types = await typeRepo.find();
    return res.status(200).json({ data: types });
}