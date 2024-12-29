import { Button } from "react-bootstrap"

const Dashboard = () =>{
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

        </div>
    )
}

export default Dashboard