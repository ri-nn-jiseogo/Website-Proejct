import React, { useState } from 'react';
import { Form, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addUser, getUsers } from "../../firebase.js"; // 사용자 추가 로직을 Firestore에도 저장할 경우
import Logo from "../../assets/logo.png";


const Register = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const userid = e.target.elements.user.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.passwords.value;
    const confirmpass = e.target.elements.confirmpass.value;
    const firstname = e.target.elements.firstname.value;
    const lastname = e.target.elements.lastname.value;

    if (!userid || !email || !password || !confirmpass || !firstname || !lastname) {
      setMessage("One or more missing data");
      return;
    }

    const users = await getUsers();
    const exists = users.docs.some(doc => doc.id === userid); // doc.id는 사용자 ID
    
    if (exists) {
      setMessage("This ID already exists");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be 8 letters or more");
      return;
    }

    if (password !== confirmpass) {
      setMessage("Confirm password does not match with password");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addUser(userid, {
        Id: userid,
        uid: user.uid,
        email: email,
        firstname: firstname,
        lastname: lastname,
        isstaff: false,
        level: 1,
      });

      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="sign-in__wrapper">
      <Form className="form" onSubmit={handleSubmit}>
        <img className="Logo" src={Logo} alt="logo" />

        {message && <Alert variant="warning">{message}</Alert>}

        <div className="mb-3">
          <label>User Id</label>
          <input type="text" className="form-control" name="user" placeholder="User Id" />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" placeholder="Email" />
        </div>
        <div className="mb-3">
          <label>Passwords</label>
          <input type="password" className="form-control" name="passwords" placeholder="Password" />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" className="form-control" name="confirmpass" placeholder="Confirm Password" />
        </div>
        <div className="mb-3">
          <label>First Name</label>
          <input type="text" className="form-control" name="firstname" placeholder="First Name" />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input type="text" className="form-control" name="lastname" placeholder="Last Name" />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered? <a href="/login">Sign in</a>
        </p>
      </Form>
    </div>
  );
};

export default Register;
