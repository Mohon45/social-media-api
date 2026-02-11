const httpStatus = require("http-status");
const Post = require("./post.model");
const ApiError = require("../../../utils/ApiError");
const { get_query } = require("../../../utils/mongooseUtils");
const User = require("../user/user.model");

const createPost = async (postBody, session = null) => {
    let options = session ? { session } : {};
    const author = await User.findById(postBody.author);
    if (!author) {
        throw new ApiError(httpStatus.NOT_FOUND, "Author not found");
    }

    postBody.username = author.username;

    const post = await Post.create([postBody], options);

    return post;
};

const getPosts = async (query) => {
    let tempQuery = { ...query };
    const searchFields = query.searchFields;
    delete query.searchFields;
    console.log(tempQuery, searchFields);
    const { data, meta, page, pageSize } = get_query(
        Post,
        tempQuery,
        {},
        searchFields,
    );

    let [singlePageData, totalDocs] = await Promise.all([data, meta]);
    await Post.populate(singlePageData, {
        path: "author",
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

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
    const post = await Post.findById(id).populate(
        "author",
        "firstName lastName email",
    );
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post;
};

const updatePost = async (postId, userId, updateBody) => {
    const post = await getPostById(postId);

    // Check if user is the author
    if (post.author._id.toString() !== userId.toString()) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You can only update your own posts",
        );
    }

    Object.assign(post, updateBody);
    await post.save();
    return post;
};

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @param {ObjectId} userId
 * @returns {Promise<Post>}
 */
const deletePost = async (postId, userId) => {
    const post = await getPostById(postId);

    // Check if user is the author
    if (post.author._id.toString() !== userId.toString()) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You can only delete your own posts",
        );
    }

    await post.remove();
    return post;
};

/**
 * Update post statistics (likes/comments count)
 * @param {ObjectId} postId
 * @param {Object} updates
 * @returns {Promise<Post>}
 */
const updatePostStats = async (postId, updates) => {
    const post = await Post.findByIdAndUpdate(postId, updates, {
        new: true,
        runValidators: true,
    }).populate("author", "firstName lastName email");

    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    return post;
};

/**
 * Increment likes count
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const incrementLikesCount = async (postId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true },
    ).populate("author", "firstName lastName email");
};

/**
 * Decrement likes count
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const decrementLikesCount = async (postId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true },
    ).populate("author", "firstName lastName email");
};

/**
 * Increment comments count
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const incrementCommentsCount = async (postId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentsCount: 1 } },
        { new: true },
    ).populate("author", "firstName lastName email");
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    updatePostStats,
    incrementLikesCount,
    decrementLikesCount,
    incrementCommentsCount,
};
