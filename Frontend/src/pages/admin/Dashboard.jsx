import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/admin.service";

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const response = await getDashboardStats();

                setStats(response.stats);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };


        fetchStats();

    }, []);


    return (
        <div className="p-8 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold mb-8">
                Admin Dashboard
            </h1>

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-gray-500">
                        Total Orders
                    </h2>

                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {stats.totalOrders}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-gray-500">
                        Total Products
                    </h2>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {stats.totalProducts}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-gray-500">
                        Total Users
                    </h2>

                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {stats.totalUsers}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-gray-500">
                        Total Revenue
                    </h2>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {stats.totalRevenue}
                    </p>
                </div>

            </div>

            {/* Quick Actions */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <Link
                    to="/admin/products"
                    className="bg-blue-600 text-white rounded-xl p-6 text-center hover:bg-blue-700"
                >
                    🛒

                    <h2 className="text-xl font-semibold mt-3">
                        Orders
                    </h2>

                    <p className="mt-2 text-sm">
                        View Orders
                    </p>

                </Link>

                <Link
                    to="/admin/orders"
                    className="bg-green-600 text-white rounded-xl p-6 text-center hover:bg-green-700"
                >
                    📦

                    <h2 className="text-xl font-semibold mt-3">
                        Product
                    </h2>

                    <p className="mt-2 text-sm">
                        Manage Products
                    </p>

                </Link>

                <Link
                    to="/admin/users"
                    className="bg-purple-600 text-white rounded-xl p-6 text-center hover:bg-purple-700"
                >
                    👥

                    <h2 className="text-xl font-semibold mt-3">
                        Users
                    </h2>

                    <p className="mt-2 text-sm">
                        Manage Users
                    </p>

                </Link>

                <Link
                    to="/admin/products/add"
                    className="bg-orange-500 text-white rounded-xl p-6 text-center hover:bg-orange-600"
                >
                    ➕

                    <h2 className="text-xl font-semibold mt-3">
                        Add Product
                    </h2>

                    <p className="mt-2 text-sm">
                        Create Product
                    </p>

                </Link>

            </div>

            {/* Recent Orders */}

            <div className="mt-12 bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-semibold mb-5">
                    Recent Orders
                </h2>

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="text-left py-3">
                                Order ID
                            </th>

                            <th className="text-left">
                                Customer
                            </th>

                            <th className="text-left">
                                Total
                            </th>

                            <th className="text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {stats.recentOrders.length > 0 ? (

                            stats.recentOrders.map((order) => (

                                <tr
                                    key={order._id}
                                    className="border-b"
                                >

                                    <td className="py-4">
                                        {order._id.slice(-8)}
                                    </td>

                                    <td>
                                        {order.user?.name || "Guest"}
                                    </td>

                                    <td>
                                        ₹{order.totalPrice}
                                    </td>

                                    <td>
                                        <span
                                            className={`inline-block w-28 text-center px-3 py-1 rounded text-white ${order.orderStatus === "Processing"
                                                    ? "bg-yellow-500"
                                                    : order.orderStatus === "Shipped"
                                                        ? "bg-blue-500"
                                                        : order.orderStatus === "Delivered"
                                                            ? "bg-green-500"
                                                            : "bg-gray-500"
                                                }`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="py-4 text-center"
                                >
                                    No Orders Yet
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Dashboard;