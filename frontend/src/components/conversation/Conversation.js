import React from "react";
import axios from "axios";
import "./Conversation.css";
import { Avatar } from "@material-ui/core";

function Conversation({
  user,
  conversation,
  setCurrConversationUser,
  setCurrConversation,
}) {
  const [friend, setFriend] = React.useState({});

  React.useEffect(() => {
    async function getFriend() {
      try {
        const friendId = conversation.members.find((el) => el !== user._id);
        console.log(friendId, user._id);
        const res = await axios.get(`user/${friendId}`);
        setFriend(res.data.data.user);
        // console.log(res.data.data.user);
      } catch (error) {
        console.log(error);
        if (error.response) {
          // Request made and server responded
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          console.log("hello");
          alert(
            `Error (${error.response.status}):\n${error.response.data.message}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log("response not recieved from server");
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          alert("Error", error.message);
        }
      }
    }

    getFriend();
  }, []);

  return (
    <div
      id={conversation._id}
      className="conversation"
      onClick={(el) => {
        setCurrConversationUser(friend);
        setCurrConversation(conversation);
        document
          .querySelectorAll(".conversation")
          .forEach((el) => (el.style.backgroundColor = "gray"));
        el.target.closest(".conversation").style.backgroundColor = "black";
      }}
    >
      <Avatar
        src={friend && friend.profileImg ? friend.profileImg : ""}
        alt="image"
        className="conversation__image"
      />
      <p className="conversation__name">{friend ? friend.username : ""}</p>
    </div>
  );
}

export default Conversation;
