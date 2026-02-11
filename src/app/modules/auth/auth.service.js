const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const ApiError = require("../../../utils/ApiError");
const User = require("../user/user.model");

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const passVerify = await bcrypt.compare(password, user.password);

    if (passVerify === false) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Incorrect email or password",
        );
    }
    const userObject = user.toObject ? user.toObject() : { ...user };
    delete userObject.password;

    return userObject;
};

module.exports = {
    loginUserWithEmailAndPassword,
};
