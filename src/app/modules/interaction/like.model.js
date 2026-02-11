const mongoose = require("mongoose");
const { toJSON } = require("../../../utils/plugins");

const likeSchema = mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

likeSchema.plugin(toJSON);

likeSchema.index({ post: 1, user: 1 }, { unique: true });
const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
