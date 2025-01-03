import { JsonDb } from "./DB/jsonDb";
import { ExpenseService } from "./service/expenseServeice";
import { Command } from "commander";

async function main() {
  const db = new JsonDb();
  await db.init();
  const expenseService = new ExpenseService(db);
  const program = new Command();
  program
    .name("expense-tracker")
    .description("CLI for tracking expenses")
    .version("1.0.0");

  program
    .command("add")
    .description("Add a new expense")
    .requiredOption("--description <string>", "Description of the expense")
    .requiredOption("--amount <number>", "Amount of the expense")
    .action(async (options) => {
      const { description, amount } = options;
      const { id } = await expenseService.add({
        description,
        amount: Number(amount),
      });
      console.log(`Expense added successfully (ID: ${id})`);
    });

  program
    .command("list")
    .description("List all expenses")
    .action(async () => {
      const datas = await expenseService.list();
      console.table(datas);
    });

  program
    .command("summary")
    .description("Get a summary of expenses")
    .option("--month <month>", "Summary for a specific month")
    .action(async (options) => {
      const sum = await expenseService.summary(Number(options.month));
      console.log(`# Total expenses: $`, sum);
    });

  program
    .command("delete")
    .description("Delete an expense by ID")
    .requiredOption("--id <id>", "ID of the expense to delete")
    .action(async (options) => {
      const expense = await expenseService.delete(Number(options.id));
      if (expense) {
        console.log(`Expense deleted successfully (ID: ${expense.id})`);
      } else {
        console.log(`Expense not found (ID: ${options.id})`);
      }
    });

  program.parse();
}

main();
