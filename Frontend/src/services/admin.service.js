import api from "../api/axios";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
};

export const getAllOrders = async () => {

    const response = await api.get(
        "/admin/orders"
    );

    return response.data;

};

export const updateOrderStatus = async (id, data) => {

    const response = await api.patch(
        `/admin/orders/${id}`,
        data
    );

    return response.data;

};

export const getOrderById = async(id)=>{

    const response = await api.get(`/admin/orders/${id}`);

    return response.data;

};

export const getAllUsers = async (params) => {

    const response = await api.get(
        "/admin/users",
        {
            params
        }
    );

    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.patch(
        `/admin/users/${id}`,
        {
            role,
        }
    );

    return response.data;
};