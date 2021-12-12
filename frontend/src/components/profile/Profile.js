import React from "react";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { MdArrowDropDown } from "react-icons/md";
import PopUpModal from "../popUpModal/PopUpModal";
import "./profile.css";

const url = `http://127.0.0.1:8080`;

function Profile({ match, user, setUser }) {
  const [profile, setProfile] = React.useState({});
  const [posts, setPosts] = React.useState([]);

  const [followersModalOpen, setFollowersModalOpen] = React.useState(false);
  const followersModalHandleOpen = () => setFollowersModalOpen(true);
  const followersModalHandleClose = () => setFollowersModalOpen(false);

  const [followingModalOpen, setFollowingModalOpen] = React.useState(false);
  const followingModalHandleOpen = () => setFollowingModalOpen(true);
  const followingModalHandleClose = () => setFollowingModalOpen(false);
  // console.log(posts);
  React.useEffect(() => {
    console.log("hello");
    async function getResponse() {
      try {
        const res = await axios.get(`/${match.params.username}`);
        setProfile(res.data.data.user);
        setPosts(res.data.data.posts);
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

    getResponse();
    // console.log(user);
    // console.log(profile);
  }, []);

  async function follow() {
    try {
      const res = await axios.patch(`/user/follow`, {
        follow: profile._id,
      });

      console.log(res);
      window.localStorage.setItem("user", JSON.stringify(res.data.data.user));
      setUser(res.data.data.user);
      setProfile(res.data.data.follow);
    } catch (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
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

  async function unfollow() {
    try {
      const res = await axios.patch(`/user/unfollow`, {
        unfollow: profile._id,
      });

      console.log(res);
      window.localStorage.setItem("user", JSON.stringify(res.data.data.user));
      setUser(res.data.data.user);
      setProfile(res.data.data.unfollow);
    } catch (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
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

  function isFollowing(profileUser) {
    return user.following &&
      user.following.find((el) => el._id === profileUser._id)
      ? true
      : false;
  }

  console.log(isFollowing(profile));

  return (
    <div className="profile">
      <header className="profile__header">
        <div className="profile__headerImgBox">
          <Avatar
            src={`${url}/${profile.profileImg}`}
            alt={profile.username}
            className="profile__headerImg"
          />
        </div>
        <div className="profile__headerInfoBox">
          <div className="profile__usenameBox">
            <h2>{profile.username}</h2>
            {user.username !== profile.username ? (
              isFollowing(profile) ? (
                <button className="profile__headerEditBtn" onClick={unfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="profile__headerFollowBtn" onClick={follow}>
                  Follow
                </button>
              )
            ) : (
              <button
                className="profile__headerEditBtn"
                onClick={() => console.log("hellos")}
              >
                Edit Profile
              </button>
            )}
          </div>
          <div className="profile__headerInfo">
            <span>
              <strong>{posts.length}</strong> Posts
            </span>
            <span>
              <a
                onClick={followersModalHandleOpen}
                className="profile__followerFollowingBtn"
              >
                <strong>
                  {profile.followers ? profile.followers.length : "0"}
                </strong>{" "}
                Followers
              </a>
            </span>
            <span>
              <a
                onClick={followingModalHandleOpen}
                className="profile__followerFollowingBtn"
              >
                <strong>
                  {profile.following ? profile.following.length : "0"}
                </strong>{" "}
                Following
              </a>
            </span>
          </div>
          <h3>{profile.name}</h3>
        </div>
      </header>

      <div className="profile__posts">
        {posts.map((post) => (
          <div className="profile__postsImgContainer" key={post._id}>
            <img
              src={`/${post.imageUrl}`}
              alt={post.username}
              className="profile__postsImg"
            />
          </div>
        ))}
      </div>
      <PopUpModal
        open={followersModalOpen}
        handleOpen={followersModalHandleOpen}
        handleClose={followersModalHandleClose}
        userArr={profile.followers}
        title="Followers"
      />
      <PopUpModal
        open={followingModalOpen}
        handleOpen={followingModalHandleOpen}
        handleClose={followingModalHandleClose}
        userArr={profile.following}
        following={true}
        title="Follow"
      />
    </div>
  );
}

export default Profile;
