import { Link } from "@tanstack/react-router";

const Navbar = () => {
    return (
        <div className="p-4 bg-background shadow-md flex gap-6 justify-center items-center rounded-xl mx-auto w-fit mt-4">
            <Link
                to="/"
                className="[&.active]:font-bold text-foreground px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
                Home
            </Link>
            <Link
                to="/about"
                className="[&.active]:font-bold text-foreground px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
                About
            </Link>
            <Link
                to="/expenses"
                className="[&.active]:font-bold text-foreground px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
                Expenses
            </Link>
            <Link
                to="/create-expenses"
                className="[&.active]:font-bold text-foreground px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
                CreateExpense
            </Link>
        </div>
    );
};

export default Navbar;
