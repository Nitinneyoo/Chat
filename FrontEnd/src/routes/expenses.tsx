import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonRow } from "@/components/SkeletonRow";
import { useQuery } from "@tanstack/react-query";

type Expenses = {
  id: number;
  amount: number;
  title: string;
};

const getAllExpenses = async () => {
  await new Promise((r) => setTimeout(r, 10));
  const res = await api.expenses.$get();

  if (!res.ok) {
    throw new Error("Server Error");
  }
  return await res.json();
};

const Expenses = () => {
  const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);

  const { data, error, isFetching } = useQuery({
    queryKey: ["get-all-expense"],
    queryFn: getAllExpenses,
  });

  if (error) return <p className="text-red-500 text-center">{error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Sheet>
        <Table className="rounded-md overflow-hidden shadow-md border border-border bg-card">
          <TableCaption className="text-sm py-2 text-muted-foreground">
            A list of your recent expenses.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              data?.expenses.map((expense: Expenses) => (
                <SheetTrigger key={expense.id} asChild>
                  <TableRow
                    className="cursor-pointer transition-all hover:bg-muted/50"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </SheetTrigger>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-muted/40">
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                {isFetching ? (
                  <Skeleton className="h-4 w-12 ml-auto" />
                ) : (
                  `$${data?.expenses
                    .reduce((sum: number, e: Expenses) => sum + e.amount, 0)
                    .toFixed(2)}`
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <SheetContent className="lg:max-w-[600px] w-full bg-background border-l border-border">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-foreground">
              Expense Details
            </SheetTitle>
            <SheetDescription>
              {isFetching ? (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Invoice ID:</strong>{" "}
                    <Skeleton className="h-4 w-24 inline-block" />
                  </p>
                  <p>
                    <strong>Title:</strong>{" "}
                    <Skeleton className="h-4 w-32 inline-block" />
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    <Skeleton className="h-4 w-20 inline-block" />
                  </p>
                </div>
              ) : selectedExpense ? (
                <div className="mt-4 space-y-2 text-foreground">
                  <p>
                    <strong>Invoice ID:</strong> {selectedExpense.id}
                  </p>
                  <p>
                    <strong>Title:</strong> {selectedExpense.title}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${selectedExpense.amount.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-muted-foreground">Select an expense to view details.</p>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});
