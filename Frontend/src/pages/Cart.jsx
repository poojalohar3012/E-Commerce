import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getCart,
    updateCart,
    removeCartItem,
} from "../services/cart.service";
import { useNavigate } from "react-router-dom";

function Cart() {
       const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load cart"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncrease = async (productId, quantity) => {
        try {
            await updateCart(productId, {
                quantity: quantity + 1,
            });

            fetchCart();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update cart"
            );
        }
    };

    const handleDecrease = async (productId, quantity) => {
        if (quantity === 1) {
            return;
        }

        try {
            await updateCart(productId, {
                quantity: quantity - 1,
            });

            fetchCart();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update cart"
            );
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeCartItem(productId);

            toast.success("Product removed from cart");

            fetchCart();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to remove product"
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    if (!cart || cart.data.items.length === 0) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-bold">
                    Your cart is empty
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            {cart.data.items.map((item) => {

                const image =
                    typeof item.product.image === "string"
                        ? item.product.image
                        : item.product.image?.url;

                return (
                    <div
                        key={item.product._id}
                        className="flex items-center gap-6 border rounded-lg p-4 mb-4"
                    >

                        <img
                            src={image}
                            alt={item.product.name}
                            className="w-28 h-28 object-cover rounded"
                        />

                        <div className="flex-1">

                            <h2 className="text-xl font-semibold">
                                {item.product.name}
                            </h2>

                            <p className="text-gray-500">
                                ₹{item.product.price}
                            </p>

                            <div className="flex items-center gap-4 mt-3">

                                <button
                                    onClick={() =>
                                        handleDecrease(
                                            item.product._id,
                                            item.quantity
                                        )
                                    }
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    -
                                </button>

                                <span className="font-bold text-lg">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        handleIncrease(
                                            item.product._id,
                                            item.quantity
                                        )
                                    }
                                    className="bg-gray-200 px-3 py-1 rounded"
                                >
                                    +
                                </button>

                            </div>

                            <p className="font-bold mt-3">
                                Subtotal: ₹
                                {item.product.price * item.quantity}
                            </p>

                            <button
                                onClick={() =>
                                    handleRemove(item.product._id)
                                }
                                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Remove
                            </button>

                        </div>

                    </div>
                );
            })}

            <div className="text-right mt-8">

                <h2 className="text-2xl font-bold">
                    Total Items: {cart.totalItems}
                </h2>

                <h2 className="text-3xl font-bold mt-2">
                    Total: ₹{cart.totalAmount}
                </h2>

               <button
                 onClick={() => navigate("/checkout")}
                 className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
                >
                 Proceed to Checkout
               </button>

            </div>

        </div>
    );
}

export default Cart;