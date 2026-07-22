import api from "../api/axios";

export const placeOrder = async (data) => {
    const response = await api.post("/orders", data);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const verifyPayment = async (data) => {
    const response = await api.post("/orders/verify-payment", data);
    return response.data;
};