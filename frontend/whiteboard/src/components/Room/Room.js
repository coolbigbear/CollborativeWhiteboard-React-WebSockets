import React, { useState, useEffect } from 'react'

import queryString from 'query-string'
import Canvas from '../Canvas/Canvas'
import socket from '../socket'
import { convertBufferToMap } from '../../util/bufferUtils'
import { setMemory } from '../Canvas/Memory'
import { test } from '../Canvas/messageManager'

const Room = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        setName(name);
        setRoom(room);
        test()

        socket.emit("initCanvas")

        socket.on("initCanvas", (memory) => {
            console.log("INCOMING MEMORY", convertBufferToMap(memory))
            setMemory(convertBufferToMap(memory))
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [location.search]);

    return (
        <div >
            <Canvas name={name}></Canvas>
        </div>
    )
}

export default Room;