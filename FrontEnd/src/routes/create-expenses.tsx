import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";

export const Route = createFileRoute("/create-expenses")({
  component: CreateExpenses,
});

function CreateExpenses() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });

      if (!res.ok) throw new Error("Server Error");

      console.log(value);
      navigate({ to: "/expenses" });
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border border-border bg-card rounded-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
            Create New Expense
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Title is required"
                    : value.length < 3
                      ? "Title must be at least 3 characters"
                      : undefined,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  return (
                    value.includes("error") && 'No "error" allowed in title'
                  );
                },
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    placeholder="Enter expense title"
                    className="w-full"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="amount"
              validators={{
                onChange: ({ value }) =>
                  value === undefined || value === null
                    ? "Value is required"
                    : value <= 0
                      ? "Value must be greater than 0"
                      : undefined,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async () => undefined,
              }}
              children={(field) => (
                <div className="space-y-1">
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    id={field.name}
                    placeholder="Enter amount"
                    type="number"
                    className="w-full"
                    value={field.state.value?.toString() || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value))
                    }
                  />
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "..." : "Submit"}
                  </Button>
                </div>
              )}
            />
          </form>
        </div>
      </Card>
    </div>
  );
}
