const users = [];

const addUser = (id, name, room) => {

    let admin = false;
    
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);
    if (existingUser) {
        console.log("username taken in room")
        return {error: "Username taken in room"};
    }

    if (getUsersInRoom(room).length == 0) {
        // User is first in room, becomes admin
        console.log("Making user admin")
        admin = true
    } 
    
    const user = {id, name, room, admin};
    
    users.push(user);

    console.log("Adding user!: ", user)
    console.log("List of users ", users)

    if (admin == false) {
        let approval = {approve: user}
        return {approval, user};
    } else {
        return {user}
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if ( index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id == id)
};

const getAdminInRoom = (room) => {
    return users.find(user => user.room == room & user.admin == true)
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getAdminInRoom };