const express = require("express");
const interactionController = require("./interaction.controller");
const validate = require("../../middleware/validate");
const interactionValidation = require("./interaction.validation");
const auth = require("../../middleware/auth");

const router = express.Router();

router.post(
    "/:id/like",
    auth.verifyToken,
    validate(interactionValidation.likePost),
    interactionController.likePost,
);

router.post(
    "/:id/comment",
    auth.verifyToken,
    validate(interactionValidation.addComment),
    interactionController.commentOnPost,
);

router.get(
    "/:id/likes",
    auth.verifyToken,
    validate(interactionValidation.getPostLikes),
    interactionController.getPostLikes,
);

router.get(
    "/:id/comments",
    auth.verifyToken,
    interactionController.getPostComments,
);

module.exports = router;
