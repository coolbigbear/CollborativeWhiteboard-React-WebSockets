import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import socket from '../socket'
import { convertBufferToJSON, convertBufferToMap } from '../../util/bufferUtils';
import { setMemory } from '../Canvas/Memory';

const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState(123456);
    const history = useHistory();

    
    useEffect(() => {
        socket.on("approved", (user) => {
            console.log("approved")
            alert("Host has approved")
            socket.emit("initCanvas")
    
            socket.on("initCanvas", (memory) => {
                console.log("Incoming whiteboard data")
                console.log("INCOMING MEMORY", convertBufferToMap(memory))
                setMemory(convertBufferToMap(memory))
                console.log("Converting user")
                history.push(`/room?room=${user.room}&name=${user.name}`)
            })
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
        roomNo = roomNo.toString()
        console.log("Generating Random room no")
        emitJoin(name, roomNo)
    }

    function joinAlreadyCreatedRoom() {
        emitJoin(name, room)
    }

    function emitJoin(name, room) {
        if (name == null) {
            name = ""
        }
        else if (room == null) {
            room = ""
        }
        setRoom(room)
        setName(name)
        socket.emit('join', { name, room }, (status) => {
            if (status) {
                console.log("Converting join status")
                status = convertBufferToJSON(status)
                console.log(status)
                alert(status.error)
            } else {
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