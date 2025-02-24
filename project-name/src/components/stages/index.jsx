import { useState } from "react"
import "./stages.css"
import InfiniteScroll from "react-infinite-scroll-component"
import { userState } from '../../models/userinfos'
import { useSetRecoilState, useRecoilValue } from 'recoil';


import {getlevel, getUsers} from "../../firebase.js";


const Stages = () => {

    const user = useRecoilValue(userState);

    const [lastlevel, setLastlevel] = useState(0)



    const stageinfo = {
        stagelevel: 1,
        userlevel: ["Ben", "Kait"],
    }
    // const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => `${i + 1}`));

    const [items, setItems] = useState([])

    // {stagelevel: 1, userlevel: []}

    const fetchData = () => {
        console.log("Next");
        setTimeout(() => {
            const newItems = Array.from({ length: 10 }, (_, i) => `${items.length + i + 1}`);
            setItems((oldArray) => [...oldArray, ...newItems]);
        }, 1500);
    };

    const refresh = () => {
        console.log("refresh");
        getlevel().then((level) => {
            console.log(level)
            if(level){
                const filtered = level.docs
                    .filter(element => {
                        console.log(element.id);
                        return element.id < user.level + 5;
                    })
                    .map(i => ({
                        stagelevel: i.id,  // Assigning stagelevel from element id
                        userlevel: i.data() // Assigning userlevel from element data
                    }));

                setItems(filtered);
            }
        })
        const newValue = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
        setItems(newValue);
    };




    return(
        <div className="stages-main">
            <div className="score">
                <h1>Stages</h1>
                <p className = "stage-desc">Collect points to climb through each stage! <br/> If you complete hidden missions along the way, you can also skip stages!</p>
                <div className="pointer">
                    {/* <div className="pointer-content">
                        <div className="point-display">
                            <p> 2300</p>
                        </div>
                        <p> points</p>
                    </div> */}
                    <p className="pointer-content">12313</p>
                </div>
            </div>
            <div className="path"
            id = "path"
            style={{
                height: "90%",
                overflow: 'auto',
                display: 'flex',
                // flexDirection: 'column-reverse',
              }}
            >
                <InfiniteScroll
                    dataLength= {items.length} //This is important field to render the next data
                    next={fetchData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                        </p>
                    }
                    // below props only if you need pull down functionality
                    refreshFunction={refresh}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                    }
                    scrollableTarget="path"
                    >
                        {items.map((i, index) => (
                            <div key={index} style = {{height: "20px"}}>
                            div - #{i.stagelevel} / {i.userlevel}
                            </div>
                        ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Stages