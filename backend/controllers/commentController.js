const Comments = require("../models/commentModel");

exports.createComment = async (req, res) => {
  try {
    let comment = await Comments.create({
      ...req.body,
      user: req.user._id,
    });

    comment = await comment
      .populate({
        path: "user",
        select: "username profileImg",
      })
      .execPopulate();

    res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comments.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
