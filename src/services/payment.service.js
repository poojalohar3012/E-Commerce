const razorpay = require("../config/razorpay");

const createRazorpayOrder = async (amount) => {

    const options = {
        amount: amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return order;
};

module.exports = {
    createRazorpayOrder,
};