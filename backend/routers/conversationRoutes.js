const express = require("express");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, conversationController.createConversation)
  .get(authController.protect, conversationController.getConversationsOfUser);

module.exports = router;
