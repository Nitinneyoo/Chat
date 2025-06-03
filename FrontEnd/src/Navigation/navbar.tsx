import { Link } from "@tanstack/react-router";

const Navbar = () => {
    return (
        <div className="p-2 flex gap-2 justify-center items-center" >
            <Link to="/" className="[&.active]:font-bold text-foreground">
                Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold text-foreground">
                About
            </Link>
            <Link to="/expenses" className="[&.active]:font-bold text-foreground">
                Expenses
            </Link>
            <Link to="/create-expenses" className="[&.active]:font-bold text-foreground">
                CreateExpense
            </Link>
        </div>
    )
}

export default Navbar;
