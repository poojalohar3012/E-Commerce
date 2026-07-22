import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../services/order.service";

function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await getOrderById(id);

            setOrder(response.order);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch order"
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-bold">
                    Loading...
                </h2>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-bold">
                    Order not found
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                Order Details
            </h1>

            {/* Order Info */}

            <div className="border rounded-lg p-5 mb-6">

                <p>
                    <strong>Order ID:</strong> {order._id}
                </p>

                <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                </p>

                <p>
                    <strong>Order Status:</strong>{" "}
                    {order.orderStatus}
                </p>

                <p>
                    <strong>Payment Status:</strong>{" "}
                    {order.paymentStatus}
                </p>

                <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod}
                </p>

            </div>

            {/* Shipping */}

            <div className="border rounded-lg p-5 mb-6">

                <h2 className="text-xl font-bold mb-3">
                    Shipping Address
                </h2>

                <p>{order.shippingAddress.address}</p>

                <p>
                    {order.shippingAddress.city},
                    {" "}
                    {order.shippingAddress.state}
                </p>

                <p>{order.shippingAddress.postalCode}</p>

                <p>{order.shippingAddress.country}</p>

            </div>

            {/* Products */}

            <div>

                <h2 className="text-xl font-bold mb-4">
                    Ordered Products
                </h2>

                {order.orderItems.map((item) => {

                    const image =
                        typeof item.image === "string"
                            ? item.image
                            : item.image?.url;

                    return (

                        <div
                            key={item.product._id}
                            className="flex items-center gap-5 border rounded-lg p-4 mb-4"
                        >

                            <img
                                src={image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />

                            <div className="flex-1">

                                <h3 className="text-lg font-semibold">
                                    {item.name}
                                </h3>

                                <p>
                                    Price: ₹{item.price}
                                </p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                <p className="font-bold mt-2">
                                    Subtotal: ₹
                                    {item.price * item.quantity}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

            <div className="text-right mt-8">

                <h2 className="text-3xl font-bold">
                    Total: ₹{order.totalPrice}
                </h2>

            </div>

        </div>
    );
}

export default OrderDetails;