import api from "../api/axios";

export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

export const updateProfile = async (formData) => {
    const response = await api.put("/users/profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};