const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const userService = require("./user.service");
const mongoose = require("mongoose");
const { httpResponse } = require("../../../utils/httpResponse");

const createUser = catchAsync(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const user = await userService.createUser(req.body, { session });
        await session.commitTransaction();
        res.status(httpStatus.CREATED).json(
            httpResponse("success", user, "User created successfully."),
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

const getUsers = catchAsync(async (req, res) => {
    try {
        const { query } = req;
        const result = await userService.getUsers(query);
        res.status(httpStatus.OK).json(
            httpResponse("success", result, "Users retrieved successfully."),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const getUser = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }
        res.status(httpStatus.OK).json(
            httpResponse("success", user, "User retrieved successfully."),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

module.exports = {
    createUser,
    getUsers,
    getUser,
};
