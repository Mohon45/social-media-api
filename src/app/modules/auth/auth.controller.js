const mongoose = require("mongoose");
const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const authService = require("./auth.service");
const userService = require("../user/user.service");
const { httpResponse } = require("../../../utils/httpResponse");
const jwt = require("jsonwebtoken");
const { addCookies, clearCookies } = require("../../../utils/authUtils");
const User = require("../user/user.model");

const register = catchAsync(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const user = await userService.createUser(req.body, session);
        await session.commitTransaction();
        res.status(httpStatus.CREATED).json(
            httpResponse("success", user, "User registered successfully!"),
        );
    } catch (error) {
        await session.abortTransaction();
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    } finally {
        session.endSession();
    }
});

const login = catchAsync(async (req, res) => {
    let { email, password } = req.body;

    if (email && password) {
        const user = await authService.loginUserWithEmailAndPassword(
            email,
            password,
        );

        let userJwtData = {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            id: user._id,
        };

        const accessToken = jwt.sign(
            userJwtData,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "360m",
            },
        );

        const refreshToken = jwt.sign(
            userJwtData,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1d",
            },
        );

        addCookies(res, { ...userJwtData, accessToken, refreshToken });

        await User.updateOne({ _id: user?._id }, { lastLoggedIn: new Date() });

        let tempUser = {
            ...user,
        };
        tempUser["token"] = accessToken;
        tempUser["refreshToken"] = refreshToken;
        res.status(httpStatus.OK).json(
            httpResponse("success", tempUser, "Logged in successfully."),
        );
    }
});

const logout = catchAsync(async (req, res) => {
    clearCookies(res);
    res.status(httpStatus.OK).json(
        httpResponse("success", {}, "Logged out successfully."),
    );
});

module.exports = {
    register,
    login,
    logout,
};
