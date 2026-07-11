import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600"
                >
                    ShopEase
                </Link>

                {/* Search */}
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-6">

                    <Link to="/" className="hover:text-blue-600">
                        Home
                    </Link>

                    <Link to="/cart" className="hover:text-blue-600">
                        Cart
                    </Link>

                    <Link to="/login" className="hover:text-blue-600">
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Register
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;