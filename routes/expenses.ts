import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(30),
	amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostScheme = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
	{
		id: 1,
		title: "Groceries",
		amount: 50,
	},
	{
		id: 2,
		title: "Gas",
		amount: 40,
	},
	{
		id: 3,
		title: "Movie tickets",
		amount: 50,
	},
];

export const expensesRoute = new Hono()

	.get("/", (c) => {
		// console.log("/get", fakeExpenses)
		return c.json({ expenses: fakeExpenses });
	})

	.post("/", zValidator("json", createPostScheme), async (c) => {
		const expense = c.req.valid("json");
		fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
		// console.log("/post", fakeExpenses)
		return c.json(expense);
	})

	.get("/total-expense", (c) => {
		const totalAmount = fakeExpenses.reduce(
			(sum, expense) => sum + expense.amount,
			0,
		);
		return c.json({ totalAmount });
	})

	.get("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const expense = fakeExpenses.find((expense) => expense.id === id);
		// console.log("/id", fakeExpenses)

		if (!expense) {
			return c.notFound();
		}
		return c.json({ expense });
	})

	.delete("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const index = fakeExpenses.findIndex((expense) => expense.id === id);

		if (index === -1) {
			return c.notFound();
		}
		const deletedExpense = fakeExpenses.splice(index, 1)[0];
		return c.json({ expense: deletedExpense });
	});
