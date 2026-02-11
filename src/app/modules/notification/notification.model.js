const mongoose = require("mongoose");
const { toJSON } = require("../../../utils/plugins");

const notificationSchema = mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        type: {
            type: String,
            enum: ["like", "comment"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        commentContent: {
            type: String,
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);

// Add indexes for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

/**
 * @typedef Notification
 */
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
