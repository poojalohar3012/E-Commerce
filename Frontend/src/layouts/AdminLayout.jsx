import { Link, Outlet, useNavigate } from "react-router-dom";


function AdminLayout() {

    const navigate = useNavigate();

   const handleLogout = () => {

    const confirmLogout = window.confirm(
        "Do you want to logout?"
    );

    if (confirmLogout) {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        navigate("/login");
    }
};
    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden">

            {/* Sidebar */}
           <aside className="w-64 fixed left-0 top-0 h-screen bg-gray-900 text-white p-6">

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
           <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">

                <Outlet />

            </main>

        </div>
    );
}

export default AdminLayout;