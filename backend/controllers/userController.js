const User = require("../models/userModel");
const mongoose = require("mongoose");

const getPopulatedUser = async (id) => {
  const userResponse = await User.findById(id);
  return await userResponse
    .populate({
      path: "following",
      select: "_id username profileImg",
    })
    .populate({
      path: "followers",
      select: "_id username profileImg",
    })
    .execPopulate();
};

exports.getPopulatedUser = getPopulatedUser;

exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      profileImg: req.file ? req.file.path : undefined,
      createdAt: Date.now(),
    });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(403).json({
      satus: "failed",
      data: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(403).json({
      satus: "failed",
      data: err,
    });
  }
};

exports.follow = async (req, res) => {
  const { follow } = req.body;
  try {
    if (!follow) {
      throw new Error(`Please provide follow`);
    }
    if (!req.user) throw new Error(`Please login again`);

    if (req.user.following.includes(follow))
      throw new Error("Already following");

    let followingResponse = await User.findByIdAndUpdate(
      follow,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    if (!followingResponse) throw new Error(`Object Id of follwing is wrong`);

    let userResponse = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: follow },
      },
      { new: true }
    );

    userResponse = await userResponse
      .populate({
        path: "following",
        select: "_id username profileImg",
      })
      .populate({
        path: "followers",
        select: "_id username profileImg",
      })
      .execPopulate();

    followingResponse = await followingResponse
      .populate({
        path: "following",
        select: "_id username profileImg",
      })
      .populate({
        path: "followers",
        select: "_id username profileImg",
      })
      .execPopulate();

    res.status(200).json({
      status: "success",
      data: {
        user: userResponse,
        follow: followingResponse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const { unfollow } = req.body;
    if (!unfollow) throw new Error(`Please provide unfollow id`);

    if (!req.user) throw new Error(`Please login again`);

    if (!req.user.following.includes(unfollow))
      throw new Error(`Cannot unfollow non-followed users`);

    let unfollowResponse = await User.findByIdAndUpdate(
      unfollow,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    if (!unfollowResponse) throw new Error(`Object Id of unfollow is wrong`);

    let userResponse = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: unfollow },
      },
      { new: true }
    );

    //Populating user's and profile's followers and following
    userResponse = await userResponse
      .populate({
        path: "following",
        select: "_id username profileImg",
      })
      .populate({
        path: "followers",
        select: "_id username profileImg",
      })
      .execPopulate();

    unfollowResponse = await unfollowResponse
      .populate({
        path: "following",
        select: "_id username profileImg",
      })
      .populate({
        path: "followers",
        select: "_id username profileImg",
      })
      .execPopulate();

    res.status(200).json({
      status: "success",
      data: { user: userResponse, unfollow: unfollowResponse },
    });
  } catch (err) {
    res.status(400).json({
      status: " failed",
      message: err.message,
    });
  }
};
