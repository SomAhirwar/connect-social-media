import React from "react";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { io } from "socket.io-client";

import inputSetState from "../../utils/inputSetState";
import Conversation from "../conversation/Conversation";
import Message from "../message/Message";
import "./Chat.css";

function Chat({ user, friend }) {
  const [message, setMessage] = React.useState("");
  const [conversations, setConversations] = React.useState([]);
  const [currConversationUser, setCurrConversationUser] = React.useState({});
  const [currConversation, setCurrConversation] = React.useState({});
  const [conversationMessages, setConversationMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState({});

  const messageInput = React.useRef();
  const scrollRef = React.useRef();
  const socket = React.useRef();
  // console.log(user);
  React.useEffect(() => {
    async function getAllConversations() {
      try {
        const res = await axios.get("/conversation");
        // const resMsg = await axios.get(`/message/${currConversation._id}`);
        // console.log(res.data.data.conversations);
        setConversations(res.data.data.conversations);
        // setConversationMessages(res.data.data.conversations);
      } catch (error) {
        console.log(error);
        if (error.response) {
          // Request made and server responded
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          alert(
            `Error (${error.response.status}):\n${error.response.data.error}`
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

    //get all conversation
    getAllConversations();

    //Connect to socket
    socket.current = io("ws://localhost:8000");

    //Add listener for real-time Message
    socket.current.on("getMessage", (res) => {
      setNewMessage(res);
    });
  }, []);

  React.useEffect(() => {
    const userId = user._id;
    const reciverId = currConversationUser._id;
    setConversationMessages((prev) => [...prev, newMessage]);
  }, [newMessage]);

  React.useEffect(() => {
    console.log(scrollRef);
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  React.useEffect(() => {
    async function getConversationMessage() {
      try {
        if (!currConversation._id) return;
        const res = await axios.get(`/message/${currConversation._id}`);
        // console.log({ res });
        setConversationMessages(res.data.data.messages);
      } catch (error) {
        console.log(error);
        if (error.response) {
          // Request made and server responded
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          alert(
            `Error (${error.response.status}):\n${error.response.data.error}`
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

    getConversationMessage();
  }, [currConversation]);

  React.useEffect(() => {
    if (user._id) socket.current.emit("addUser", user._id);
  }, [user]);

  // console.log({ conversationMessages });
  async function sendMessage() {
    try {
      if (!message) return;
      const res = await axios.post("/message", {
        conversation: currConversation._id,
        text: message,
      });

      setConversationMessages((prev) => [...prev, res.data.data.message]);

      socket.current.emit("sendMessage", {
        reciverId: currConversationUser._id,
        message: res.data.data.message,
      });

      setMessage("");
    } catch (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        alert(
          `Error (${error.response.status}):\n${error.response.data.error}`
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

  return (
    <div className="chat">
      <div className="chat__leftBox">
        <div className="chat__leftBoxUp">
          <h3>{user.username}</h3>
        </div>
        <div className="chat__leftBoxDown">
          {conversations.map((el) => (
            <Conversation
              key={el._id}
              user={user}
              conversation={el}
              setCurrConversationUser={setCurrConversationUser}
              setCurrConversation={setCurrConversation}
            />
          ))}
        </div>
      </div>
      <div className="chat__rightBox">
        <div className="chat__rightBoxUp">
          <div className="chat__friendProfile">
            <Avatar
              src={
                currConversationUser.profileImg
                  ? currConversationUser.profileImg
                  : ""
              }
              alt="image"
              className="chat__friendProfileImg"
            />
            <div className="chat__friendProfileName">
              <h3>
                {currConversationUser.username
                  ? currConversationUser.username
                  : ""}
              </h3>
              <p>last seen</p>
            </div>
          </div>
        </div>
        <div className="chat__rightBoxMid">
          {conversationMessages.map((el) => (
            <div ref={scrollRef}>
              <Message message={el} user={user} key={el._id} />
            </div>
          ))}
        </div>
        <div className="chat__rightBoxDown">
          <input
            type="text"
            className="chat__messageBox"
            ref={messageInput}
            placeholder="Message"
            value={message}
            onChange={inputSetState(setMessage)}
            onKeyPress={(el) => {
              if (el.which === 13) {
                sendMessage();
                messageInput.current.value = "";
                messageInput.current.focus();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
