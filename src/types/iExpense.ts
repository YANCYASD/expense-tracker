export enum CategoryEnum {
  Food,
  Transport,
  Entertainment,
  Shopping,
  Health,
  Education,
  Other,
}

export interface iExpense {
  id: number;
  date: Date;
  description: string;
  amount: number;
  category: CategoryEnum;
}
