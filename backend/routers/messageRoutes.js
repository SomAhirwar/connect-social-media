const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").post(authController.protect, messageController.createMessage);
router
  .route("/:conversation")
  .get(authController.protect, messageController.getMessage);

module.exports = router;
