import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './Join.css';
import socket from '../socket'

const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState(123456);
    const history = useHistory();

    useEffect(() => {
        socket.on("approved", (user) => {
            console.log("approve")
            alert("Host has approved")
            history.push(`/room?room=${user.room}&name=${user.name}`)
        })

        socket.on("denied", (user) => {
            console.log("denied")
            alert("Host has denied")
        })

        return () => {
            
        }
    }, [])


    async function generateRandomRoomNo() {
        let roomNo = Math.floor(100000 + Math.random() * 900000)
        console.log("Generating Random room no")
        history.push(`/room?room=${roomNo}&name=${name}`)
    }

    function joinAlreadyCreatedRoom() {
        socket.emit('join', { name, room }, (status) => {
            console.log(status)
            if (status.error) {
                alert(status.error)
            }
            else if (status.data) {
                // alert(status.data)
                history.push(`/room?room=${room}&name=${name}`)
            }
        });
    }

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}></input></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)}></input></div>
                <button className="button mt-20" type="submit" onClick={joinAlreadyCreatedRoom} >Join existing room</button>
                <button className="button mt-20" type="submit" onClick={generateRandomRoomNo} >Create private room</button>
            </div>
        </div>
    )
}

export default Join;