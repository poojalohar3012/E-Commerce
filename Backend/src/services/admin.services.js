const User = require("../models/User");

const getAllUsers = async (query) => {

    const {
        page = 1,
        limit = 10,
        search = "",
        role
    } = query;


    const filter = {};


    // Search by name or email
    if (search) {

        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];

    }


    // Filter by role
    if (role) {
        filter.role = role;
    }


    const skip = (page - 1) * limit;


    const users = await User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(Number(limit))
        .sort({
            createdAt: -1
        });


    const totalUsers = await User.countDocuments(filter);


    return {
        users,
        totalUsers,
        currentPage: Number(page),
        totalPages: Math.ceil(
            totalUsers / limit
        )
    };

};

const updateUserRole = async (userId, role) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.role = role;

    await user.save();

    return user;
};

module.exports = {
    getAllUsers,
    updateUserRole,
};