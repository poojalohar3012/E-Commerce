import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {placeOrder,verifyPayment} from "../services/order.service";

function Checkout() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    paymentMethod: "COD",
});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        const orderData = {
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            },
            paymentMethod: formData.paymentMethod,
        };

        const response = await placeOrder(orderData);

        toast.success(response.message);

        if (formData.paymentMethod === "COD") {
    setTimeout(() => {
        navigate("/myorders");
    }, 1500);
} else {

    console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: response.razorpayOrder.amount,
        currency: response.razorpayOrder.currency,
        name: "E-Commerce Store",
        description: "Order Payment",

        order_id: response.razorpayOrder.id,

        handler: async function (paymentResponse) {

            try {

                const verifyResponse = await verifyPayment({
                    razorpay_order_id:
                        paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                        paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                        paymentResponse.razorpay_signature,
                });

                toast.success(verifyResponse.message);

                navigate("/myorders");

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Payment verification failed"
                );

            }

        },

        theme: {
            color: "#16a34a",
        },
    };

    if (!window.Razorpay) {
    toast.error("Razorpay SDK failed to load");
    return;
}

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {

        toast.error(response.error.description);

    });

    razorpay.open();
}

    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to place order"
        );
    } finally {
        setLoading(false);
    }
   };
    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">
                Checkout
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div>

                    <label className="block font-semibold mb-2">
                        Shipping Address
                    </label>

                   <input
    type="text"
    name="address"
    placeholder="Address"
    value={formData.address}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
    required
/>

<input
    type="text"
    name="city"
    placeholder="City"
    value={formData.city}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
    required
/>

<input
    type="text"
    name="state"
    placeholder="State"
    value={formData.state}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
    required
/>

<input
    type="text"
    name="postalCode"
    placeholder="Postal Code"
    value={formData.postalCode}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
    required
/>

<input
    type="text"
    name="country"
    placeholder="Country"
    value={formData.country}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
    required
/>

                </div>

                <div>

                    <label className="block font-semibold mb-2">
                        Payment Method
                    </label>

                    <div className="space-y-2">

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={formData.paymentMethod === "COD"}
                                onChange={handleChange}
                            />
                            Cash on Delivery
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Online"
                                checked={formData.paymentMethod === "Online"}
                                onChange={handleChange}
                            />
                            Razorpay
                        </label>

                    </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>

            </form>

        </div>
    );
}

export default Checkout;