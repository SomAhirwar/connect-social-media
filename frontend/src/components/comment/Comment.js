import React from "react";
import Avatar from "@material-ui/core/Avatar";

import "./Comment.css";

function Comment({ comment }) {
  return (
    <div className="comment">
      <div className="comment__user">
        <Avatar
          alt={comment.username}
          className="comment__avatar"
          src={comment.user.profileImg}
        />
        <h5 className="comment__username">{comment.user.username}</h5>
      </div>
      <div className="comment__body">{comment.comment}</div>
    </div>
  );
}

export default Comment;
