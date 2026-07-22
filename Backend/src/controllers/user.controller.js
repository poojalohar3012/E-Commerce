const userService = require("../services/user.service");

const getProfile = async (req, res) => {
    try {

        const user = await userService.getProfile(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const updateProfile = async (req, res) => {

    try {

        const user = await userService.updateProfile(
            req.user.id,
            req.body,
            req.file
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    getProfile,
    updateProfile,
};