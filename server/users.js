const users = [];

const addUser = ({ id, name, room, hadTurn, hasGuessed, isDrawing}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);
    if (existingUser) {
        return {error: "User name have been taken"};
    }

    const user = {id, name, room, hadTurn, hasGuessed, isDrawing};

    users.push(user);
    console.log("Adding user!: ", users)
    return {user};
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

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };