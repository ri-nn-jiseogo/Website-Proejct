import React, { useState, useEffect } from 'react';
import "../../styles.css";
import "../Mypage/mypage.css";

const mypage = () => {

    return (
        <div className="mypage">
            <div className="content">
                <div className="TextBox">
                    <div className="flex-container">
                        <h1 className="missons">My Page</h1>
                    </div>
                </div>
                <div className="info-container">
                    <h1 className="mission-title">Welcome, Benjamin Oh</h1>
                    <div className="info">
                        <div className="profile">
                            <div className="flex-box">
                                <h1 className="section-name">Profile</h1>
                                <button className="Profile-button">Edit</button>
                            </div>
                            <div className="profile-info">
                                <h1 className="section-name">Email: </h1>
                                <h1 className="section-name">Name: </h1>
                                <h1 className="section-name">Grade: </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




export default mypage;