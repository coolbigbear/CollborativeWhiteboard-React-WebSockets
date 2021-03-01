import React, { useState, useEffect } from 'react'
import queryString from 'query-string'

import Canvas from '../Canvas/Canvas.js'

import socket from '../socket'

const Room = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        console.log("yes");

        setName(name);
        setRoom(room);

        console.log(name);

        socket.emit('join', { name, room }, () => {
        });

        //socket.emit('message', (data), () => {

        //});

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

        return () => {
            //socket.emit('disconnect');
            //socket.off();
        }
    }, ['localhost:5000', location.search]);

    return (
        <div>
            <Canvas></Canvas>
        </div>
    )
}

export default Room;