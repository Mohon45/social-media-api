const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const notificationService = require("./notification.service");
const pick = require("../../../utils/pick");

/**
 * Get user notifications
 */
const getNotifications = catchAsync(async (req, res) => {
    const options = pick(req.query, ["limit", "page"]);
    const result = await notificationService.getUserNotifications(
        req.user._id,
        options,
    );

    res.send({
        success: true,
        message: "Notifications retrieved successfully",
        data: result,
    });
});

/**
 * Mark a notification as read
 */
const markNotificationAsRead = catchAsync(async (req, res) => {
    const notification = await notificationService.markAsRead(
        req.params.id,
        req.user._id,
    );

    res.send({
        success: true,
        message: "Notification marked as read",
        data: notification,
    });
});

/**
 * Mark all notifications as read
 */
const markAllAsRead = catchAsync(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user._id);

    res.send({
        success: true,
        message: result.message,
        data: result,
    });
});

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead,
};
