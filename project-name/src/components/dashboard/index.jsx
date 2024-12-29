import { Button } from "react-bootstrap"
import { userState } from '../../models/userinfos'
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'


const Dashboard = () =>{
    const setuser = useSetRecoilState(userState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    return(
        <div>
            class - progress
            Basic information
            <Button
                onClick={(e) => {
                    e.preventDefault()
                    console.log("onclick")
                }}
            >
                Continue Lecture
            </Button>

            <Button
                onClick={(e) => {
                    // setuser({
                    //     Id: undefined,
                    //     name: undefined
                    // })
                    navigate('/login')
                }}
            >
                Log Out
            </Button>

        </div>
    )
}

export default Dashboard