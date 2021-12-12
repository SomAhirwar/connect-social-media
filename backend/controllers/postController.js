const Posts = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const mongoose = require("mongoose");

exports.createPost = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const post = await Posts.create({
    caption: req.body.caption,
    imageUrl: req.file.path,
    createdAt: Date.now(),
    user: req.user._id,
  });

  const resPost = await Posts.findById(post._id);
  // console.log(resPost);
  res.status(201).json({
    status: "success",
    data: {
      post: resPost,
    },
  });
};

exports.getAllPost = async (req, res) => {
  const posts = await Posts.find().sort("-createdAt").populate("comments");
  res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
};

exports.deletePost = async (req, res, next) => {
  const post = await Posts.findByIdAndDelete(req.params.id);

  if (!post) return next(new Error("Cannot find post"));

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.getAllUserPost = async (req, res, next) => {
  try {
    const username = req.params.username;
    // console.log({ username });
    let user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    user = await user
      .populate({
        path: "following",
        select: "_id username profileImg",
      })
      .populate({
        path: "followers",
        select: "_id username profileImg",
      })
      .execPopulate();

    const posts = await Posts.find({ user: user._id });

    res.status(200).json({
      status: "success",
      data: {
        user,
        posts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.like = async (req, res) => {
  try {
    const postId = req.body.postId;
    const user = req.user._id;
    if (!postId)
      throw new Error("To like an object request should have 'postId'");

    let post = await Posts.findById(postId);
    if (!post) throw new Error("Post not exists");

    //if user is not already liked the post, then like it, else unlike post
    if (
      !post.likes.some((el) => {
        return el._id.equals(user); //This is how we compare two ids of mongoose doc
      })
    ) {
      post = await Posts.findByIdAndUpdate(
        postId,
        {
          $push: { likes: mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    } else {
      post = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: mongoose.Types.ObjectId(user) },
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
