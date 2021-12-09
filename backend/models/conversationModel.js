const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
      required: [true, "please provide both conversations id"],
    },
  },
  {
    timestamps: true,
  }
);

const Conversations = mongoose.model("Conversations", conversationSchema);

module.exports = Conversations;
