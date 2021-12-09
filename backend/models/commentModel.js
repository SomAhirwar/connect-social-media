const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "Comment cannot be empty"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Comment must belong to user"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      require: [true, "Comment must belong to post"],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username profileImg",
  });
  next();
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
