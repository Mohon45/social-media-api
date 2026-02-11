const express = require("express");
const postController = require("./post.controller");
const validate = require("../../middleware/validate");
const postValidation = require("./post.validation");
const auth = require("../../middleware/auth");

const router = express.Router();

router.post(
    "/",
    auth.verifyToken,
    validate(postValidation.createPost),
    postController.createPost,
);

router.get(
    "/",
    auth.verifyToken,
    // validate(postValidation.getPosts),
    postController.getPosts,
);

router.get(
    "/:id",
    auth.verifyToken,
    validate(postValidation.postById),
    postController.getPost,
);

router.put(
    "/:id",
    auth.verifyToken,
    validate(postValidation.updatePost),
    postController.updatePost,
);

router.delete(
    "/:id",
    auth.verifyToken,
    validate(postValidation.postById),
    postController.deletePost,
);

module.exports = router;
