const mongoose = require("mongoose");
const io = require("../server");

const postSchema = new mongoose.Schema(
  {
    caption: String,
    imageUrl: {
      type: String,
      required: [true, "Please upload the image"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to an user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username profileImg",
  }).populate({
    path: "likes",
    select: "_id username profileImg",
  });

  next();
});

postSchema.virtual("comments", {
  ref: "Comments",
  foreignField: "post",
  localField: "_id",
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
