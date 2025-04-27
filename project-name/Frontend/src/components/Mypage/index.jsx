import React, { useState, useEffect } from 'react';
import "../../styles.css";
import "../Mypage/mypage.css";

const mypage = () => {

    return(
        <div className="mypage">
            <div className="content">
            <div className="TextBox">
                <div className="flex-container">
                    <h1 className="missons">My Page</h1>
                </div>
            </div>
            <div className="info-container">
                    <h1 className="mission-title">Lesson Mission History</h1>
                </div>
        </div>
        </div>
    )
}




export default mypage;