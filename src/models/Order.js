const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [orderItemSchema],

        shippingAddress: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Card", "UPI", "Razorpay"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },

        razorpayOrderId: {
            type: String,
        },

        paymentResult: {
            paymentId: {
                type: String,
            },

            orderId: {
                type: String,
            },

            signature: {
                type: String,
            },
        },

        orderStatus: {
            type: String,
            enum: [
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Processing",
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        deliveredAt: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);