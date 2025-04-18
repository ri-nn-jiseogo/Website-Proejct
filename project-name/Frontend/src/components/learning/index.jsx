import { useState } from "react"
import "./learning.css"
import InfiniteScroll from "react-infinite-scroll-component"
import { userState } from '../../models/userinfos/index.js'
import { useSetRecoilState, useRecoilValue } from 'recoil';


import { getlevel, getUsers } from "../../firebase.js";
import { Button } from "react-bootstrap";

import { Link } from "react-router-dom"

const learning = () => {

    return (
        <div className="learning">
            <div className="TextBox">
                <div className="flex-container">
                    <h1 className="missons">Missons</h1>
                    <button className="desc-button">?</button>
                </div>
                <p className="stage-desc">In the game, you are allowed to participate in up to 15 missions at a time. <br /> If you wish to join more missions, you must wait for a cooldown period before you can continue.</p>
            </div>
            <div className="chapter-container">
                <div className="Chapter">
                <Link to="/user/learning/lesson1" className="chapter-link">
                    <h1 className="chapter-title">Lesson 1</h1>
                    <div className="chapter-desc">
                        <p>Primitive Types</p>
                    </div>
                </Link>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 2</h1>
                <div className="chapter-desc">
                    <p>Boolean Expressions and if Statements</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 3</h1>
                <div className="chapter-desc">
                    <p>Iteration</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 4</h1>
                <div className="chapter-desc">
                    <p>Writing Classes</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 5</h1>
                <div className="chapter-desc">
                    <p>Array</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 6</h1>
                <div className="chapter-desc">
                    <p>ArrayList</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 7</h1>
                <div className="chapter-desc">
                    <p>2D Array</p>
                </div>
            </div>
            <div className="Chapter">
                <h1 className="chapter-title">Lesson 8</h1>
                <div className="chapter-desc">
                    <p>Recursion</p>
                </div>
            </div>
        </div>
        </div >
    )
}

export default learning