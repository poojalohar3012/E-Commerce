const User = require("../models/User");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const updateProfile = async (userId, data, file) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (data.name) {
        user.name = data.name;
    }

    if (file) {

        const image = await uploadToCloudinary(file.buffer);

        user.profileImage = {
            url: image.url,
            public_id: image.public_id,
        };
    }

    await user.save();

    return user;
};

module.exports = {
    getProfile,
    updateProfile,
};
