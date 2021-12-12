import React from "react";
import PopUpModal from "../popUpModal/PopUpModal";
import Avatar from "@material-ui/core/Avatar";
import { send } from "react-icons-kit/fa/send";
import { thumbsUp } from "react-icons-kit/feather/thumbsUp";
import { ic_thumb_up } from "react-icons-kit/md/ic_thumb_up";
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
  user,
}) {
  const [newComment, setNewComment] = React.useState("");
  const [likesArr, setLikesArr] = React.useState(likes || []);

  const [LikesArrModalOpen, setLikesArrModalOpen] = React.useState(false);
  const likesArrModalHandleOpen = () => setLikesArrModalOpen(true);
  const likesArrModalHandleClose = () => setLikesArrModalOpen(false);

  const [allComment, dispatch] = React.useReducer(
    reducer,
    comments ? comments : []
  );

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

  async function likePost() {
    try {
      const res = await axios.patch("/posts/like", {
        postId,
      });
      console.log(res.data.data);
      setLikesArr(res.data.data.post.likes);
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
            <div className="post__userInfoBox">
              <div className="post__avatar">
                <Avatar
                  alt={username}
                  className="post__avatar"
                  src={url + "/" + profileImg}
                />
              </div>
              <div className="post__description">
                <div className="post__likeBox">
                  <Icon
                    className="post__likeIcon"
                    icon={
                      likesArr && likesArr.some((el) => el._id === user._id)
                        ? ic_thumb_up
                        : thumbsUp
                    }
                    style={
                      likesArr && likesArr.some((el) => el._id === user._id)
                        ? { color: "white" }
                        : {}
                    }
                    size={30}
                    onClick={likePost}
                  />
                  <div className="post__likeCount">
                    <a
                      role="button"
                      className="post__likeCount-anchor"
                      onClick={() => setLikesArrModalOpen("true")}
                    >
                      {likesArr.length} likes
                    </a>
                  </div>
                </div>
                <div className="post__username">
                  <span>
                    <a href={`/${username}`} className="post__username-anchor">
                      <strong>{username}</strong>
                    </a>
                  </span>{" "}
                  <span>{caption}</span>
                </div>
              </div>
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
                <Comment key={el._id} comment={el} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PopUpModal
        open={LikesArrModalOpen}
        handleOpen={likesArrModalHandleOpen}
        handleClose={likesArrModalHandleClose}
        userArr={likesArr}
        title="Likes"
      />
    </div>
  );
}

export default Post;
