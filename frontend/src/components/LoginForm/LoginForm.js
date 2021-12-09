import React from "react";
import loginLogo from "../../img/login_logo.png";
import "./LoginForm.css";
import axios from "axios";
const url = `http://127.0.0.1:8080`;

function LoginForm({
  username,
  password,
  usernameSetState,
  passwordSetState,
  setAuthenticated,
  setUser,
}) {
  const usernameLabelRef = React.useRef();
  const passwordLabelRef = React.useRef();

  async function onLogin(event) {
    event.preventDefault();
    try {
      const user = await axios.post(
        `/user/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      window.localStorage.setItem("user", JSON.stringify(user.data.data.user));
      setUser(user.data.data.user);
      setAuthenticated("true");
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
    <div
      className="authentication-box"
      style={{
        background: `url(${process.env.PUBLIC_URL}/post-bg.jpg)repeat right`,
      }}
    >
      <div className="auth">
        <div className="auth__image-container">
          <img
            className="auth-form__image"
            src={`${process.env.PUBLIC_URL}/logo.png`}
          ></img>
        </div>
        <form className="auth__form" onSubmit={onLogin}>
          <label className="auth__label" ref={usernameLabelRef}>
            <span>username</span>

            <input
              className="auth__input"
              value={username}
              onFocus={() => {
                usernameLabelRef.current.style.boxShadow =
                  "0 2px 5px rgba(110, 110, 110, 0.877)";
              }}
              onBlur={() => {
                usernameLabelRef.current.style.boxShadow = "none";
              }}
              onChange={usernameSetState}
              required={true}
            />
          </label>

          <label className="auth__label" ref={passwordLabelRef}>
            <span>password</span>

            <input
              className="auth__input"
              type="password"
              value={password}
              onFocus={() => {
                passwordLabelRef.current.style.boxShadow =
                  "0 2px 5px rgba(110, 110, 110, 0.877)";
              }}
              onBlur={() => {
                passwordLabelRef.current.style.boxShadow = "none";
              }}
              onChange={passwordSetState}
              required={true}
            />
          </label>

          <button className="auth__submit">Log In</button>
        </form>
      </div>
      <div className="signup">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
}

export default LoginForm;
