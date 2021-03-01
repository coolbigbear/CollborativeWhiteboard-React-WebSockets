import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './Join.css';

const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState(123456);
    const history = useHistory();


    async function generateRandomRoomNo() {
        let roomNo = Math.floor(100000 + Math.random() * 900000)
        console.log("Generating Random room no")
        history.push(`/room?room=${roomNo}&name=${name}`)
    }

    function joinAlreadyCreatedRoom() {
        console.log("joining an existing room");
        history.push(`/room?room=${room}&name=${name}`)
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}></input></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)}></input></div>
                {/* <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/room?room=${room}&name=${name}`}>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>*/}
                <button className="button mt-20" type="submit" onClick={joinAlreadyCreatedRoom} >Join existing room</button>
                <button className="button mt-20" type="submit" onClick={generateRandomRoomNo} >Create private room</button>
            </div>
        </div>
    )
}

export default Join;