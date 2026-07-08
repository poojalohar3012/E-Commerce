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
            address: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Card", "UPI"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending",
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

        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);