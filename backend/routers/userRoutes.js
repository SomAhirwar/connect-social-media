const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const setUpUpload = require("../upload");
const upload = setUpUpload("./public/profileImg");

const router = express.Router();

router
  .route("/signup")
  .post(upload.single("profileImg"), authController.signup);

router.route("/login").post(authController.login);
// router.route("/").post(upload.single("profileImg"), userController.createUser);

router.route("/logout").get(authController.logout);

router.route("/follow").patch(authController.protect, userController.follow);
router
  .route("/unfollow")
  .patch(authController.protect, userController.unfollow);

router.route("/:id").get(userController.getUser);

module.exports = router;
