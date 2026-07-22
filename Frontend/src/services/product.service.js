import api from "../api/axios";

export const getAllProducts = async () => {
    const response = await api.get("/products");
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};


export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const createProduct = async (formData) => {

    const response = await api.post(
        "/products",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const updateProduct = async (id, formData) => {

    const response = await api.patch(
        `/products/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};