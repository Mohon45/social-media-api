const httpStatus = require("http-status");
const Notification = require("./notification.model");
const User = require("../user/user.model");
const firebaseService = require("../../../utils/firebase.service");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a notification in the database
 * @param {Object} notificationData
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationData) => {
    const notification = await Notification.create(notificationData);
    await notification.populate([
        { path: "sender", select: "firstName lastName email" },
        { path: "post", select: "content" },
    ]);
    return notification;
};

/**
 * Send FCM notification to a user
 * @param {ObjectId} userId
 * @param {Object} notification
 * @param {Object} data
 * @returns {Promise<string|null>}
 */
const sendFCMNotification = async (userId, notification, data = {}) => {
    try {
        const user = await User.findById(userId);

        if (!user || !user.fcmToken) {
            console.log(`User ${userId} does not have an FCM token`);
            return null;
        }

        const response = await firebaseService.sendNotification(
            user.fcmToken,
            notification,
            data,
        );

        return response;
    } catch (error) {
        console.error("Error sending FCM notification:", error);
        // Don't throw error - notification failure shouldn't break the request
        return null;
    }
};

/**
 * Notify user when their post is liked
 * @param {ObjectId} postAuthorId
 * @param {ObjectId} likerId
 * @param {ObjectId} postId
 * @returns {Promise<Notification>}
 */
const notifyPostLike = async (postAuthorId, likerId, postId) => {
    const liker = await User.findById(likerId);
    const likerName =
        `${liker.firstName || ""} ${liker.lastName || ""}`.trim() || "Someone";

    // Create notification in database
    const notification = await createNotification({
        recipient: postAuthorId,
        sender: likerId,
        post: postId,
        type: "like",
        message: `${likerName} liked your post`,
    });

    // Send FCM notification
    await sendFCMNotification(
        postAuthorId,
        {
            title: "New Like",
            body: `${likerName} liked your post`,
        },
        {
            type: "like",
            postId: postId.toString(),
            senderId: likerId.toString(),
            notificationId: notification._id.toString(),
        },
    );

    return notification;
};

/**
 * Notify user when their post is commented on
 * @param {ObjectId} postAuthorId
 * @param {ObjectId} commenterId
 * @param {ObjectId} postId
 * @param {string} commentContent
 * @returns {Promise<Notification>}
 */
const notifyPostComment = async (
    postAuthorId,
    commenterId,
    postId,
    commentContent,
) => {
    const commenter = await User.findById(commenterId);
    const commenterName =
        `${commenter.firstName || ""} ${commenter.lastName || ""}`.trim() ||
        "Someone";

    // Truncate comment for notification
    const truncatedComment =
        commentContent.length > 50
            ? commentContent.substring(0, 50) + "..."
            : commentContent;

    // Create notification in database
    const notification = await createNotification({
        recipient: postAuthorId,
        sender: commenterId,
        post: postId,
        type: "comment",
        message: `${commenterName} commented on your post`,
        commentContent: truncatedComment,
    });

    // Send FCM notification
    await sendFCMNotification(
        postAuthorId,
        {
            title: "New Comment",
            body: `${commenterName}: ${truncatedComment}`,
        },
        {
            type: "comment",
            postId: postId.toString(),
            senderId: commenterId.toString(),
            notificationId: notification._id.toString(),
        },
    );

    return notification;
};

/**
 * Get user notifications with pagination
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const getUserNotifications = async (userId, options) => {
    const limit =
        options.limit && parseInt(options.limit, 10) > 0
            ? parseInt(options.limit, 10)
            : 20;
    const page =
        options.page && parseInt(options.page, 10) > 0
            ? parseInt(options.page, 10)
            : 1;
    const skip = (page - 1) * limit;

    const filter = { recipient: userId };

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "firstName lastName email")
        .populate("post", "content")
        .exec();

    const totalResults = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });
    const totalPages = Math.ceil(totalResults / limit);

    return {
        results: notifications,
        page,
        limit,
        totalPages,
        totalResults,
        unreadCount,
    };
};

/**
 * Mark notification as read
 * @param {ObjectId} notificationId
 * @param {ObjectId} userId
 * @returns {Promise<Notification>}
 */
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
};

/**
 * Mark all notifications as read for a user
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true },
    );

    return {
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} notifications marked as read`,
    };
};

module.exports = {
    createNotification,
    sendFCMNotification,
    notifyPostLike,
    notifyPostComment,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};
