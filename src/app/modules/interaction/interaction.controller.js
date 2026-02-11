const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const interactionService = require("./interaction.service");
const notificationService = require("../notification/notification.service");
const postService = require("../post/post.service");
const { httpResponse } = require("../../../utils/httpResponse");

const likePost = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await interactionService.toggleLike(id, userId);

        // Send notification if post was liked (not unliked)
        if (result.liked) {
            const post = await postService.getPostById(id);

            if (post.author._id.toString() !== userId.toString()) {
                await notificationService.notifyPostLike(
                    post.author._id,
                    userId,
                    id,
                );
            }
        }

        res.status(httpStatus.OK).json(
            httpResponse("success", result, result.message),
        );
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const commentOnPost = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        const comment = await interactionService.addComment(
            id,
            userId,
            content,
        );

        const post = await postService.getPostById(id);

        if (post.author._id.toString() !== userId.toString()) {
            await notificationService.notifyPostComment(
                post.author._id,
                userId,
                id,
                content,
            );
        }

        res.status(httpStatus.CREATED).json(
            httpResponse("success", comment, "Comment added successfully"),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const getPostLikes = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        const likes = await interactionService.getPostLikes(id);

        res.status(httpStatus.OK).json(
            httpResponse("success", likes, "Likes retrieved successfully"),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

const getPostComments = catchAsync(async (req, res) => {
    try {
        const query = req.query;

        const result = await interactionService.getPostComments(query);
        res.status(httpStatus.OK).json(
            httpResponse("success", result, "Comments retrieved successfully"),
        );
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
            httpResponse("error", {}, error.message),
        );
    }
});

module.exports = {
    likePost,
    commentOnPost,
    getPostLikes,
    getPostComments,
};
