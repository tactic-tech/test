const express = require('express')
app = express()
const { v4: uuidV4 } = require('uuid') 
const users = {};
const socketToRoom = {};


const port = process.env.PORT || 60000;
//process.env.GOOGLE_API_KEY
var server = app.listen(port, function () {
  console.log('Node listening on port 60000')
}) 
var io = require('socket.io')(server, {
  cors: {
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('connection');
  //spicific classroom
  socket.on('classroomNotification', function (data) {
    socket.broadcast.emit('classroom_' + data.id, data);

  });

  socket.on('notification', function (data) {
    socket.broadcast.emit('notification_' + data.reciver_id, data);
  });
  socket.on("join-room", (data) => {
    socket.join(data.roomId);
    console.log(data.myname);
    socket.to(data.roomId).emit("user-connected", data.id, data.myname);

    socket.on("messagesend", (data) => {
        console.log(data.message);
        io.to(data.roomId).emit("createMessage", data.message);
    });

    socket.on("tellName", (data) => {
        console.log(data.myname);
        socket.to(data.roomId).emit("AddName", data.myname);
    });

    socket.on("disconnect", () => {
        socket.to(data.roomId).emit("user-disconnected", data.id);
    });
});
});

