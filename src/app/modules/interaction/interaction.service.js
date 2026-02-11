const httpStatus = require("http-status");
const Like = require("./like.model");
const Comment = require("./comment.model");
const ApiError = require("../../../utils/ApiError");
const postService = require("../post/post.service");
const { get_query } = require("../../../utils/mongooseUtils");

const toggleLike = async (postId, userId) => {
    const post = await postService.getPostById(postId);

    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        await postService.decrementLikesCount(postId);
        return {
            liked: false,
            message: "Post unliked successfully",
        };
    } else {
        await Like.create({ post: postId, user: userId });
        await postService.incrementLikesCount(postId);
        return {
            liked: true,
            message: "Post liked successfully",
        };
    }
};

const addComment = async (postId, userId, content) => {
    const post = await postService.getPostById(postId);

    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    const comment = await Comment.create({
        post: postId,
        user: userId,
        content,
    });

    await postService.incrementCommentsCount(postId);

    return comment;
};

const getPostLikes = async (postId) => {
    const likes = await Like.find({ post: postId })
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 });
    return likes;
};

const getPostComments = async (query) => {
    const { data, meta, page, pageSize } = get_query(Comment, query);

    let [singlePageData, totalDocs] = await Promise.all([data, meta]);
    await Comment.populate(singlePageData, {
        path: "user",
        select: "firstName lastName email",
    });
    return {
        data: singlePageData,
        metaData: {
            page,
            totalPages: Math.ceil(totalDocs[0]?.count / pageSize),
            perPage: pageSize,
            total: totalDocs[0]?.count,
        },
    };
};

module.exports = {
    toggleLike,
    addComment,
    getPostLikes,
    getPostComments,
};
