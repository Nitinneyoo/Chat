import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const getTotalExpense = async () => {
  const res = await api.expenses["total-expense"].$get();

  if (!res.ok) {
    throw new Error("Server Error");
  }
  const data = await res.json();
  return data;
};

const Index = () => {
  const { isPending, data, error, isFetching } = useQuery({
    queryKey: ["get-total-expense"],
    queryFn: getTotalExpense,
  });

  if (isPending) return "Loding .....";

  if (isFetching) return "Fetching ...";

  // biome-ignore lint/style/useTemplate: <explanation>
  if (error) return "an error has occurred : " + error.message;

  return (
    <div>
      <Card className="w-[450px] m-auto mt-1">
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
          <CardDescription>
            The Total Amount That You have Spent
          </CardDescription>
        </CardHeader>
        <CardContent>{data.totalAmount}</CardContent>
      </Card>
      <div className="flex flex-col m-auto mt-2">
        <Card className="w-[100px] m-auto ">
          <Sheet>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent className="lg:max-w-[800px] w-full">
              <SheetHeader>
                <SheetTitle>This is the Sheet Section </SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
                <Card className="flex flex-col w-[250px]">
                  <CardHeader>
                    <CardTitle>Total Expense</CardTitle>
                    <CardDescription>
                      The Total Amount That You have Spent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{data.totalAmount}</CardContent>
                </Card>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
