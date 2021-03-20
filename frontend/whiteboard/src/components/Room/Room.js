import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import queryString from 'query-string'
import Canvas from '../Canvas/Canvas'
import socket from '../socket'

const Room = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    let history = useHistory()


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        setName(name);
        setRoom(room);

        console.log("wow")
        console.log(socket)

        

        socket.on('poke');

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