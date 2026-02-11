const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth");
const authController = require("./auth.controller");
const validate = require("../../middleware/validate");
const authValidation = require("./auth.validation");

router.post(
    "/register",
    validate(authValidation.register),
    authController.register,
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", auth.verifyToken, authController.logout);

module.exports = router;
