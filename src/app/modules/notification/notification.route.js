const express = require("express");
const notificationController = require("./notification.controller");
const auth = require("../../middleware/authBearer");
const validate = require("../../middleware/validate");
const notificationValidation = require("./notification.validation");

const router = express.Router();

router.get(
    "/",
    auth(),
    validate(notificationValidation.getNotifications),
    notificationController.getNotifications,
);

router.put(
    "/:id/read",
    auth(),
    validate(notificationValidation.markAsRead),
    notificationController.markNotificationAsRead,
);

router.put("/read-all", auth(), notificationController.markAllAsRead);

module.exports = router;
