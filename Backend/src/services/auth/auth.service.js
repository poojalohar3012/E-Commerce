const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { generateAccessToken } = require("../../utils/generateToken");
const { registerValidation } = require("../../validators/auth.validator");
const { loginValidation } = require("../../validators/auth.validator");
const ApiError = require("../../utils/ApiError");

const register = async (data) => {

  const { error } = registerValidation(data);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
   throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const login = async (data) => {
  const { error } = loginValidation(data);

  if (error) {
   throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
   throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
   throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  };
};

module.exports = {
  register,
  login
};