const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const postService = require("./post.service");
const mongoose = require("mongoose");
const { httpResponse } = require("../../../utils/httpResponse");

const createPost = catchAsync(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        let content = { ...req.body };
        content.author = req.user.id;

        const post = await postService.createPost(content, session);
        await session.commitTransaction();
        res.status(httpStatus.CREATED).json(
            httpResponse("success", post, "Post created successfully."),
        );
    } catch (error) {
        await session.abortTransaction();
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    } finally {
        await session.endSession();
    }
});

const getPosts = catchAsync(async (req, res) => {
    try {
        const { query } = req;

        const result = await postService.getPosts(query);
        res.status(httpStatus.OK).json(
            httpResponse("success", result, "Post retrieved successfully."),
        );
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const getPost = catchAsync(async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        res.status(httpStatus.OK).json(
            httpResponse("success", post, "Post retrieved successfully."),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const updatePost = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user.id;

        const post = await postService.updatePost(id, user, req.body);

        res.status(httpStatus.OK).json(
            httpResponse("success", post, "Post updated successfully."),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const deletePost = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user.id;

        await postService.deletePost(id, user);
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
};
