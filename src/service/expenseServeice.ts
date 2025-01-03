import { JsonDb } from "../DB/jsonDb";
import { CategoryEnum, iExpense } from "../types/iExpense";

type addiExpense = {
  description?: iExpense["description"];
  amount: iExpense["amount"];
  category?: CategoryEnum;
};

export class ExpenseService {
  private db: JsonDb;
  constructor(db: JsonDb) {
    this.db = db;
  }

  async add(payload: addiExpense): Promise<iExpense> {
    const { description = "", amount, category = CategoryEnum.Other } = payload;
    if (!amount || typeof amount !== "number")
      throw new Error("Invalid amount");
    return await this.db.create({ description, amount, category });
  }

  async list(): Promise<iExpense[]> {
    return await this.db.findAll();
  }

  async summary(month: number): Promise<number> {
    let datas = await this.db.findAll();
    if (month) {
      if (month < 1 || month > 12) {
        console.log("# Invalid month");
        return 0;
      }
      datas = datas.filter((expense) => {
        const { date } = expense;
        return month === new Date(date).getMonth() + 1;
      });
    }
    return datas.reduce((acc, cur) => {
      return (acc += cur.amount);
    }, 0);
  }

  async delete(id: iExpense["id"]): Promise<iExpense | null> {
    return await this.db.delete(id);
  }
}
