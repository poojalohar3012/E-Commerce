import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

    const dropdownRef = useRef(null);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

   const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setShowMenu(false);

    toast.success("Logged out successfully");

    navigate("/");

   window.location.reload();
};

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

                    {!token ? (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <div
                            className="relative"
                            ref={dropdownRef}
                        >
                            <button
                                onClick={() =>
                                    setShowMenu(!showMenu)
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                My Account ▼
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">

                                     <Link
                                        to="/profile"
                                        onClick={() => setShowMenu(false)}
                                        className="block px-4 py-3 hover:bg-gray-100"
        >
                                        👤 Profile
                                    </Link>

                                    <Link
                                        to="/myorders"
                                        onClick={() =>
                                            setShowMenu(false)
                                        }
                                        className="block px-4 py-3 hover:bg-gray-100"
                                    >
                                        📦 My Orders
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                                    >
                                        🚪 Logout
                                    </button>

                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;