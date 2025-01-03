import fs from "node:fs/promises";
import path from "node:path";
import { CategoryEnum, iExpense } from "../types/iExpense";

class FileSystem {
  private filePath: string;
  constructor() {
    this.filePath = path.resolve(__dirname, "db.json");
  }
  async checkFile() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        await this.writeFile([]);
      } else {
        throw error;
      }
    }
  }

  async writeFile(data: unknown) {
    await fs.writeFile(this.filePath, JSON.stringify(data));
  }

  async readFile(): Promise<object> {
    const data = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(data);
  }
}

export class JsonDb {
  private fileSystem: FileSystem;

  constructor() {
    this.fileSystem = new FileSystem();
  }

  async init() {
    await this.fileSystem.checkFile();
  }

  async create({
    description = "",
    amount = 0,
    category = CategoryEnum.Other,
  }: Partial<iExpense>): Promise<iExpense> {
    const datas = (await this.fileSystem.readFile()) as iExpense[];
    let maxId = 0;
    if (datas.length > 0) {
      maxId = Math.max(...datas.map((data) => data.id));
    }
    const newData: iExpense = {
      id: maxId + 1,
      date: new Date(),
      description,
      amount,
      category,
    };
    datas.push(newData);
    await this.fileSystem.writeFile(datas);
    return newData;
  }

  async delete(id: iExpense["id"]): Promise<iExpense | null> {
    const datas = (await this.fileSystem.readFile()) as iExpense[];
    const index = datas.findIndex((data) => data.id === id);
    if (index === -1) {
      return null;
    }
    const deletedData = datas.splice(index, 1)[0];
    await this.fileSystem.writeFile(datas);
    return deletedData;
  }

  async update(
    id: iExpense["id"],
    {
      description = "",
      amount = 0,
      category = CategoryEnum.Other,
    }: Partial<iExpense>,
  ): Promise<iExpense | null> {
    const datas = (await this.fileSystem.readFile()) as iExpense[];
    const index = datas.findIndex((data) => data.id === id);
    datas[index] = {
      ...datas[index],
      description,
      amount,
      category,
    };
    return datas[index];
  }

  async findAll(): Promise<iExpense[]> {
    const data = await this.fileSystem.readFile();
    return data as iExpense[];
  }

  async findById(id: iExpense["id"]) {
    const datas = await this.findAll();
    return datas.find((data) => data.id === id);
  }
}
