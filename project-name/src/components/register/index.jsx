import React from 'react'
import { Form, Modal } from "react-bootstrap"
import { addUser, getUsers } from "../../firebase.js";

import Logo from "../../assets/logo.png";


const Register = () => {

    const handdleSubmit = (e) => {
        e.preventDefault()
        console.log(e.target.elements.user.value)
        console.log(e.target.elements.passwords.value)
        console.log(e.target.elements.name.value)
        console.log(e.target.elements.dob.value)
        console.log(e.target.elements.school.value)
        console.log("submitted")
        const userid = e.target.elements.user.value
        const passwords = e.target.elements.passwords.value
        const name = e.target.elements.name.value
        const className = e.target.elements.className.value
        const dob = e.target.elements.dob.value
        const school = e.target.elements.school.value

        if (userid && passwords && name && className && dob && school) {
            console.log("all requireed ok")
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
                            name: name,
                            class: className,
                            dob: dob,
                            school: school,
                            isstaff: false
                        })
                    }
                    else {
                        console.log("not available")
                        alert("Same ID")
                    }
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        else {
            console.log("missing data")
            alert("One or more missing data")
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
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="name"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Class</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Class"
                            name="className"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Date Of Birth</label>
                        <input
                            type="dob"
                            className="form-control"
                            placeholder="Date Of Birth (YYYY-MM-DD)"
                            name="dob"
                        />
                    </div>
                    <div className="mb-3">
                        <label>School</label>
                        <input
                            type="school"
                            className="form-control"
                            placeholder="School"
                            name="school"
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