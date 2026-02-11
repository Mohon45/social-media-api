var express = require("express");
var router = express.Router();
const rootRouter = router;

const authRoutes = require("../modules/auth/auth.route");
const userRoutes = require("../modules/user/user.route");
const postRoutes = require("../modules/post/post.route");
const interactionRoutes = require("../modules/interaction/interaction.route");
// const notificationRoutes = require("../modules/notification/notification.route");

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/posts", postRoutes);
rootRouter.use("/posts", interactionRoutes);
// rootRouter.use("/notifications", notificationRoutes);

module.exports = rootRouter;
