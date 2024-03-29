const socketio = require('socket.io');
const io = socketio();
const socketApi = { };
socketApi.io = io;
//helpers
const randomColor = require('../helpers/randomColor');

const users = {};

io.on('connection' , (socket) => {
    console.log('a user connected');

    socket.on('newUser', (data) => {
       const defaultData = {
           id: socket.id,
           username: data.username,
           position: {
               x: 0,
               y: 0
           },
           color : randomColor()
       }
       users[socket.id] = Object.assign(data,defaultData);

       socket.broadcast.emit('newUser',users[socket.id]);
       socket.emit('initPlayers',users);
    });



    socket.on('animate', (data) => {
       users[socket.id].position.x = data.x;
       users[socket.id].position.y = data.y;

       socket.broadcast.emit('animate', {
          socketId : socket.id,
          x : data.x,
          y: data.y
       });
    });

    socket.on('newMessage', (data) => {
        socketId = '';
        const messageData = Object.assign({socketId : socket.id} , data);
        socket.broadcast.emit('newMessages',messageData);
    });


    socket.on('disconnect' , () => {
       socket.broadcast.emit('disUser', users[socket.id]);
       delete users[socket.id];
    });

});

module.exports = socketApi;