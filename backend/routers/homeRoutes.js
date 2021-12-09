const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = express.Router();

router
  .route("/:username")
  .get(authController.protect, postController.getAllUserPost);

module.exports = router;
