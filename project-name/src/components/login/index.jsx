import "bootstrap/dist/css/bootstrap.min.css";
import "../../../src/styles.css";

import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";

import Logo from "../../assets/logo.png";

import { useNavigate } from "react-router-dom";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../models/userinfos";

import { getUsers } from "../../firebase.js";

import bcrypt from "bcryptjs";

const Login = () => {
  const [message, setMessage] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Remember Me 상태 추가

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setuser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);

  console.log(user);

  useEffect(() => {
    // 저장된 로그인 정보 불러오기
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedUsername && savedPassword) {
      setInputUsername(savedUsername);
      setInputPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user?.Id !== undefined) {
      console.log("user exists?");
      if (user?.isstaff) {
        navigate("/user/admin");
      } else {
        navigate("/user");
      }
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    setMessage("");
    event.preventDefault();
    setLoading(true);
    await delay(500);
    console.log(`Username: ${inputUsername}, Password: ${inputPassword}`);

    if (inputPassword && inputUsername) {
      getUsers()
        .then((users) => {
          console.log(users);
          if (users) {
            const filtered = users.docs.filter((element) => {
              console.log(element.id);
              return element.id === inputUsername;
            });
            console.log(filtered);
            if (filtered.length === 0) {
              setShow(true);
              setMessage("No such user");
            } else {
              console.log("available");

              const existuser = filtered[0].data();

              console.log(existuser);
              console.log(existuser.passwords);

              bcrypt.compare(inputPassword, existuser.passwords, (err, isMatch) => {
                if (err) {
                  setMessage("password does not match");
                }
                if (isMatch) {
                  setuser({
                    level: existuser.level,
                    Id: existuser.Id,
                    name: existuser.name,
                    isstaff: existuser.isstaff,
                  });

                  // Remember Me 체크 시 로그인 정보 저장
                  if (rememberMe) {
                    localStorage.setItem("savedUsername", inputUsername);
                    localStorage.setItem("savedPassword", inputPassword);
                  } else {
                    // 체크 해제 시 기존 값 삭제
                    localStorage.removeItem("savedUsername");
                    localStorage.removeItem("savedPassword");
                  }

                  
                }


              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setLoading(false);
    } else {
      setMessage("One or more field missing");
    }
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="sign-in__wrapper">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="form" onSubmit={handleSubmit}>
        {/* Header */}

        <img className="Logo" src={Logo} alt="logo" />

        {message && <div className="alert alert-warning" role="alert">{message}</div>}

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          {/* Remember Me 체크박스 추가 */}
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </Form.Group>
        <Button className="w-100" variant="primary" type="submit">
          Log In
        </Button>

        <div className="mt-2 text-center">
          <p style={{ margin: 0 }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Register Here
            </span>
          </p>
        </div>
      </Form>
      {/* Footer */}
    </div>
  );
};

export default Login;