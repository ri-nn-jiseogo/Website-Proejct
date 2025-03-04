import {React, useState} from 'react'
import { Form, Modal } from "react-bootstrap"
import { addUser, getUsers } from "../../firebase.js";

import Logo from "../../assets/logo.png";


const Register = () => {

    const [message, setMessage] = useState("")

    const handdleSubmit = (e) => {
        e.preventDefault()
        setMessage("")
        const userid = e.target.elements.user.value
        const passwords = e.target.elements.passwords.value
        const firstname = e.target.elements.firstname.value
        const lastname = e.target.elements.lastname.value
        const confirmpass = e.target.elements.confirmpass.value

        if (userid && passwords && firstname && lastname && confirmpass) {
            console.log("all requireed ok")
            if (passwords.length >= 8) {
                if (passwords === confirmpass) {
                    getUsers().then((users) => {
                        console.log(users)
                        if (users) {
                            const filtered = users.docs.filter(element => {
                                console.log(element.id)
                                return element.id === userid
                            });
                            console.log(filtered)
                            if (filtered.length === 0) {
                                console.log("available!")
                                addUser(userid, {
                                    Id: userid,
                                    passwords: passwords,
                                    firstname: firstname,
                                    lastname: lastname,
                                    isstaff: false
                                })
                            }
                            else {
                                console.log("not available")
                                setMessage("Same ID")
                            }
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                else {
                    setMessage("Confirm password does not match with password")
                }
            }
            else {
                console.log("short pass")
                setMessage("Password must be 8 letters or more")
            }
        }
        else {
            console.log("missing data")
            setMessage("One or more missing data")
        }
    }

    return (
        <div
            className="sign-in__wrapper"
        >

            <Form
                className="form"
                onSubmit={handdleSubmit}>

                <img
                    className="Logo"
                    src={Logo}
                    alt="logo"
                />

                {message && <div class="alert alert-warning" role="alert">
                    {message}
                </div>}

                <div className="mb-3">
                    <label>User Id</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="User Id"
                        name="user"
                    />
                </div>
                <div className="mb-3">
                    <label>Passwords</label>
                    <input
                        type="Passwords"
                        className="form-control"
                        placeholder="Passwords"
                        name="passwords"
                    />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                        type="dob"
                        className="form-control"
                        placeholder="Confirm Password"
                        name="confirmpass"
                    />
                </div>
                <div className="mb-3">
                    <label>First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        name="firstname"
                    />
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        name="lastname"
                    />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Sign Up
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Already registered <a href="/login">sign in?</a>
                </p>
            </Form>

        </div>
    )

}

export default Register