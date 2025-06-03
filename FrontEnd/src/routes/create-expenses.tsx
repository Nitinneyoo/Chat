import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/create-expenses")({
  component: CreateExpenses,
});

function CreateExpenses() {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <div className="min-h-screen p-6 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create New Expense
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Title is required"
                    : value.length < 3
                      ? "Value must be at least 3 characters"
                      : undefined,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return (
                    value.includes("error") &&
                    'No "error" allowed in Value'
                  );
                },
              }}
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label htmlFor={field.name}>Title</Label>
                    <Input
                      id={field.name}
                      placeholder="Enter expense title"
                      className="w-full"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Expense
                    </Button>
                    {field.state.meta.errors ? (
                      <div className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    ) : null}
                  </>
                );
              }}
            />
          </form>
        </div>
      </Card>
    </div>
  );
}
