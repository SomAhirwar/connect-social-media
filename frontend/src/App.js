import React from "react";
import axios from "axios";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import SignupForm from "./components/signupForm/SignupForm";
import UploadForm from "./components/uploadForm/UploadForm";
import Profile from "./components/profile/Profile";
import Chat from "./components/chat/Chat";
import inputSetState from "./utils/inputSetState";
import "./App.css";

const url = `http://127.0.0.1:8080`;

function App() {
  const [posts, setPosts] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(
    () => localStorage.getItem("authenticated") === "true"
  );

  const uploadFormRef = React.useRef();

  React.useEffect(() => {
    let mounted = true;
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (mounted) setUser(user);
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("authenticated", authenticated);

    async function getAllPosts() {
      const postServer = await axios.get(`/posts`);
      console.log(postServer.data.data.posts);
      setPosts(postServer.data.data.posts);
      return postServer;
    }

    authenticated ? getAllPosts() : setPosts([]);
  }, [authenticated]);

  return (
    <div
      className="app"
      style={{ background: `url(${process.env.PUBLIC_URL}/page-bg.jpg)` }}
    >
      {authenticated ? (
        <Header
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
          setUsername={setUsername}
          setPassword={setPassword}
          setUser={setUser}
          uploadFormRef={uploadFormRef}
        />
      ) : (
        <div>&nbsp;</div>
      )}
      <UploadForm setPosts={setPosts} uploadFormRef={uploadFormRef} />
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home
                username={username}
                password={password}
                usernameSetState={inputSetState(setUsername)}
                passwordSetState={inputSetState(setPassword)}
                authenticated={authenticated}
                posts={posts}
                setAuthenticated={setAuthenticated}
                setUser={setUser}
                user={user}
              />
            )}
          />

          <Route
            path="/signup"
            render={() => (
              <SignupForm
                username={username}
                password={password}
                setAuthenticated={setAuthenticated}
                usernameSetState={inputSetState(setUsername)}
                passwordSetState={inputSetState(setPassword)}
                setUser={setUser}
              />
            )}
          />

          <Route path="/chat" exact render={() => <Chat user={user} />} />
          <Route
            path="/:username"
            exact
            render={({ match }) => (
              <Profile match={match} user={user} setUser={setUser} />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
