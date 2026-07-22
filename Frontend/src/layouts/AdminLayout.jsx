import { Link, Outlet, useNavigate } from "react-router-dom";


function AdminLayout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6">

                <h1 className="text-2xl font-bold mb-8">
                    Admin Panel
                </h1>

                <nav className="space-y-4">

                    <Link
                        to="/admin/dashboard"
                        className="block hover:text-blue-400"
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        className="block hover:text-blue-400"
                    >
                        📦 Products
                    </Link>

                    <Link
                        to="/admin/products/add"
                        className="block hover:text-blue-400"
                    >
                        ➕ Add Product
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="block hover:text-blue-400"
                    >
                        🛒 Orders
                    </Link>

                    <Link
                        to="/admin/users"
                        className="block hover:text-blue-400"
                    >
                        👥 Users
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="text-left hover:text-red-400"
                    >
                        🚪 Logout
                    </button>

                </nav>

            </aside>


            {/* Main Content */}
            <main className="flex-1 p-8">

                <Outlet />

            </main>

        </div>
    );
}

export default AdminLayout;