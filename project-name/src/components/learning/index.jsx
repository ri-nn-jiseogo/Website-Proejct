import { useState } from "react"
import "./learning.css"
import InfiniteScroll from "react-infinite-scroll-component"
import { userState } from '../../models/userinfos'
import { useSetRecoilState, useRecoilValue } from 'recoil';


import { getlevel, getUsers } from "../../firebase.js";
import { Button } from "react-bootstrap";


const learning = () => {



    return (
        <div>
            <div className="TextBox">
                <div className ="flex-container" class="flex-container">
                    <h1>Missons</h1>
                    <button>?</button>
                </div>
                <p className="stage-desc">In the game, you are allowed to participate in up to 15 missions at a time. <br /> If you wish to join more missions, you must wait for a cooldown period before you can continue.</p>
            </div>
            <div>

            </div>
        </div>
    )
}

export default learning