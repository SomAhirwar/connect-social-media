import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import "./PopUpMember.css";

function PopUpMember({ profileImg, username }) {
  return (
    <div className="popUpMember">
      <Avatar alt={username} className="popUpMember__avatar" src={profileImg} />

      <div className="popUpMember__username">
        <a href={`/${username}`} className="popUpMember__usernameLink">
          <strong>{username}</strong>
        </a>
      </div>
    </div>
  );
}

export default PopUpMember;
