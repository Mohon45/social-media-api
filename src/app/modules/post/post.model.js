const mongoose = require("mongoose");
const { toJSON } = require("../../../utils/plugins");

const postSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like",
            },
        ],
    },
    {
        timestamps: true,
    },
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);

// Add index for efficient querying
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
