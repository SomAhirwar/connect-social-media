import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { send } from "react-icons-kit/fa/send";
import Icon from "react-icons-kit";
import "./Post.css";

import Comment from "../comment/Comment";
import axios from "axios";

const url = `http://127.0.0.1:8080`;

function Post({
  profileImg,
  caption,
  username,
  imageUrl,
  comments,
  likes,
  postId,
}) {
  const [newComment, setNewComment] = React.useState("");
  const [allComment, dispatch] = React.useReducer(reducer, comments);
  const commentForm = React.useRef();

  function reducer(allComments, newComment) {
    console.log(newComment);
    return [...allComments, newComment];
  }

  async function handleSubmit(el) {
    el.preventDefault();
    if (newComment === "") return;
    try {
      const res = await axios.post("/comment", {
        comment: newComment,
        post: postId,
      });
      dispatch(res.data.data.comment);
      console.log(res.data.data.comment);
      commentForm.current.style.display = "";
      setNewComment("");
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("hello");
        console.log(error.response);
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
    <div
      className="post"
      style={{
        background: `url(${process.env.PUBLIC_URL}/post-bg.jpg)repeat right`,
      }}
    >
      <div className="post__container">
        <div className="post__leftContainer">
          <img src={imageUrl} className="post__img" />
        </div>

        <div className="post__rightContainer">
          <div className="post__userInfo">
            <div className="post__avatar">
              <Avatar
                alt={username}
                className="post__avatar"
                src={url + "/" + profileImg}
              />
            </div>
            <div className="post__description">
              <div className="post__username">
                <a href={`/${username}`} className="post__username-anchor">
                  <strong>{username}</strong>
                </a>
              </div>{" "}
              <div>{caption}</div>
            </div>
          </div>
          <div className="post__commentBox">
            <div className="post__commentBoxHeader">
              <h4>Comments</h4>
              <div>
                <a
                  className="post__commentBtn"
                  onClick={(el) => {
                    commentForm.current.style.display =
                      commentForm.current.style.display === "" ? "block" : "";
                  }}
                >
                  New Comment
                </a>
              </div>
            </div>

            <form
              className="post__commentForm"
              onSubmit={handleSubmit}
              ref={commentForm}
            >
              <textarea
                className="post__commentInp"
                type="text"
                placeholder="Type Comment"
                value={newComment}
                onChange={(el) => setNewComment(el.target.value)}
              />
              <button className="post__submitBtn">
                <Icon icon={send} />
              </button>
            </form>

            <div className="post__comments">
              {allComment.map((el) => (
                <Comment comment={el} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
