import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonRow } from "@/components/SkeletonRow";

const getAllExpenses = async () => {
  await new Promise((r) => setTimeout(r, 10))
  const res = await api.expenses.$get();

  if (!res.ok) {
    throw new Error("Server Error");
  }
  const data = await res.json();
  return data;
};

const Expenses = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const { data, error, isFetching } = useQuery({
    queryKey: ["get-all-expense"],
    queryFn: getAllExpenses,
  });

  // biome-ignore lint/style/useTemplate: <explanation>
  if (error) return "an error has occurred : " + error.message;

  return (
    <div className="p-2 max-w-7xl m-auto">
      <Sheet>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              data?.expenses.map((expense) => (
                <SheetTrigger key={expense.id} asChild>
                  <TableRow
                    className="cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell className="text-right">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </SheetTrigger>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {isFetching ? (
                  <Skeleton className="h-2 w-10 ml-auto" />
                ) : (
                  `$${data?.expenses
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toFixed(2)}`
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <SheetContent className="lg:max-w-[700px] w-full">
          <SheetHeader>
            <SheetTitle>Expense Details</SheetTitle>
            <SheetDescription>
              {isFetching ? (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Invoice ID:</strong> <Skeleton className="h-4 w-24 inline-block" />
                  </p>
                  <p>
                    <strong>Title:</strong> <Skeleton className="h-4 w-32 inline-block" />
                  </p>
                  <p>
                    <strong>Amount:</strong> <Skeleton className="h-4 w-20 inline-block" />
                  </p>
                </div>
              ) : selectedExpense && (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Invoice ID:</strong> {selectedExpense.id}
                  </p>
                  <p>
                    <strong>Title:</strong> {selectedExpense.title}
                  </p>
                  <p>
                    <strong>Amount:</strong> $
                    {selectedExpense.amount.toFixed(2)}
                  </p>
                </div>
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
