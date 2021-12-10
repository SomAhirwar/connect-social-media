import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import "./FollowMember.css";

function FollowMember({ profileImg, username }) {
  return (
    <div className="followMember">
      <Avatar
        alt={username}
        className="followMember__avatar"
        src={profileImg}
      />

      <div className="followMember__username">
        <a href={`/${username}`} className="followMember__usernameLink">
          <strong>{username}</strong>
        </a>
      </div>
    </div>
  );
}

export default FollowMember;
