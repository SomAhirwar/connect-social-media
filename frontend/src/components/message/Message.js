import React from "react";
import "./Message.css";

function Message({ message, user }) {
  // console.log(user);
  // console.log(message);
  return (
    <div
      className={
        user._id === message.sender ? "message message__user" : "message"
      }
    >
      <p className="message__text">{message.text}</p>
    </div>
  );
}

export default Message;
