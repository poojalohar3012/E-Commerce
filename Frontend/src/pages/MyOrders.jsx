import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/order.service";
import { toast } from "react-toastify";

function MyOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getMyOrders();
            console.log("Orders Response:", response);
            setOrders(response.orders);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-semibold">
                    Loading...
                </h2>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-3xl font-bold">
                    No Orders Found
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                My Orders
            </h1>

            {orders.map((order) => (

                <div
                    key={order._id}
                    className="border rounded-lg shadow-md p-6 mb-6"
                >

                    <div className="flex justify-between">

                        <div>

                            <h2 className="font-bold text-lg">
                                Order ID
                            </h2>

                            <p className="text-gray-600">
                                {order._id}
                            </p>

                            <p className="mt-2">
                                Date:
                                {" "}
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>

                        </div>

                        <div className="text-right">

                            <p>
                                <strong>Status:</strong>
                                {" "}
                                {order.orderStatus}
                            </p>

                            <p>
                                <strong>Payment:</strong>
                                {" "}
                                {order.paymentStatus}
                            </p>

                            <h2 className="text-2xl font-bold mt-3">
                                ₹{order.totalPrice}
                            </h2>

                        </div>

                    </div>

                    <button
                        onClick={() =>
                            navigate(`/orders/${order._id}`)
                        }
                        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        View Details
                    </button>

                </div>

            ))}

        </div>
    );
}

export default MyOrders;