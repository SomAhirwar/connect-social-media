const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Message must have conversation"],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Message must have conversation"],
    },
    text: {
      type: String,
      minLength: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("messages", messagesSchema);

module.exports = Messages;
