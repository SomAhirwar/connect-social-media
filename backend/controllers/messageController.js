const Messages = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  try {
    const { conversation, text } = req.body;
    if (!conversation || !text)
      throw new Error("Please provide conversation and text feild both");

    const message = await Messages.create({
      conversation,
      sender: req.user._id,
      text,
    });

    res.status(201).json({
      status: "success",
      data: {
        message,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const conversationId = req.params.conversation;
    // console.log(conversationId);
    if (!conversationId) throw new Error("Please provide conversation feild");
    const messages = await Messages.find({ conversation: conversationId });
    res.status(201).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
