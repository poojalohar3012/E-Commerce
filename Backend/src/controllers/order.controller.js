const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const paymentService = require("../services/payment.service");
const crypto = require("crypto");

const placeOrder = async (req, res) => {
    try {

        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product.name} is out of stock`
                });
            }

            totalPrice += item.product.price * item.quantity;

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity
            });
        }

        const { shippingAddress, paymentMethod } = req.body;

        // =======================
        // CASH ON DELIVERY
        // =======================
        if (paymentMethod === "COD") {

            const order = await Order.create({
                user: userId,
                orderItems,
                shippingAddress,
                paymentMethod: "COD",
                paymentStatus: "Pending",
                totalPrice
            });

            // Reduce Stock
            for (const item of cart.items) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    }
                );
            }

            // Clear Cart
            cart.items = [];
            await cart.save();

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order
            });
        }

        // =======================
        // ONLINE PAYMENT
        // =======================

        const razorpayOrder =
            await paymentService.createRazorpayOrder(totalPrice);

        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod: "Online",
            paymentStatus: "Pending",
            totalPrice,

            razorpayOrderId: razorpayOrder.id
        });

        return res.status(201).json({
            success: true,
            message: "Proceed to payment",

            order,

            razorpayOrder
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });

        }

        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        order.paymentStatus = "Paid";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;

        await order.save();

        // Reduce Stock
        for (const item of order.orderItems) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );

        }

        // Clear Cart
        const cart = await Cart.findOne({
            user: order.user
        });

        if (cart) {

            cart.items = [];
            await cart.save();

        }

        return res.status(200).json({

            success: true,
            message: "Payment verified successfully",
            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("orderItems.product", "name price image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Only the owner can view the order
        if (order.user._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check ownership
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this order",
            });
        }

        // Allow update only when Processing
        if (order.orderStatus !== "Processing") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be updated after shipping",
            });
        }

        const { shippingAddress, paymentMethod } = req.body;

        if (shippingAddress) {
            order.shippingAddress = shippingAddress;
        }

        if (paymentMethod) {
            order.paymentMethod = paymentMethod;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this order",
            });
        }

        if (order.orderStatus !== "Processing") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled",
            });
        }

        // Restore stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: item.quantity,
                },
            });
        }

        order.orderStatus = "Cancelled";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Admin 
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (
            order.paymentMethod !== "COD" &&
            order.paymentStatus === "Pending" &&
            orderStatus === "Shipped"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is pending. Cannot ship this order.",
            });
        }

        order.orderStatus = orderStatus;

        if (orderStatus === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    placeOrder,
    verifyPayment,
    getMyOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus
};