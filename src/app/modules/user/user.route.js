const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth");
const userController = require("./user.controller");
const validate = require("../../middleware/validate");
const userValidation = require("./user.validation");

router.get(
    "/",
    auth.verifyToken,
    validate(userValidation.getUsers),
    userController.getUsers,
);
router.get(
    "/details/:id",
    auth.verifyToken,
    validate(userValidation.getUser),
    userController.getUser,
);
router.post(
    "/create",
    validate(userValidation.createUser),
    userController.createUser,
);

module.exports = router;
