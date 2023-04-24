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
    console.log('hhhhhhhhhhhhhhhh')
    socket.broadcast.emit('notification_' + data.reciver_id, data);
   // socket.emit('notification_' + data.reciver_id, data);

  });
  //webrtc
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

  //chat app

  let chatRoomName = "";
  let chatRoomUsers = [];
  socket.on('joinChatRoom', function (data) {
 
  chatRoomName = data.room;
    const userData = data.user;
    if (!chatRoomUsers.find((item) => item.user.id === userData.id && item.room === chatRoomName)) {
      console.log("joinChat+++++++++++++++++" + data.user.id);
      socket.join(data.room)
      chatRoomUsers.push({ id: socket.id, user: userData, room: chatRoomName })
      socket.to(chatRoomName).emit("userJoin", data);

    };
    const RoomUsers = chatRoomUsers.filter(
      (user) => user.room === chatRoomName
    );
    socket.to(chatRoomName).emit("chatroom_users", RoomUsers);
    socket.emit("chatroom_users", RoomUsers);
     
    socket.on("chatroom_users", (data) => {
      console.log("chatroom_users" + RoomUsers);
    });
    socket.on("userJoin", (data) => {
      console.log("userJoin" + data);
    });
    
    socket.on('typing', function (data) {
    //  socket.broadcast.to(data.room).emit('typing', data)
    socket.to(data.room).emit('typingMessage', data); // Send to all users in room, including sender

    })
    socket.on('sendMessage', function (data) {
      console.log("message:" + data.message);
      //socket.broadcast.to(data.room).emit('receiveMessage', data)
      socket.to(data.room).emit('receiveMessage', data); // Send to all users in room, including sender

    })
    socket.on("disconnect", () => {
      socket.leave(data.room);
      console.log("leaveChat" + data);
      socket.to(data.room).emit("userLeave", data.id);
    });
  })
  socket.on('joinConversation', function (data) {
 
  chatRoomName = data.room;
    const userData = data.user;
     socket.join(data.room)
    //  socket.on("chatroom_users", (data) => {
      console.log("chatroom_users" + userData);
    // });
    socket.on("userJoin", (data) => {
      console.log("userJoin" + data);
    });
    
    socket.on('typeMessage', function (data) {
     socket.to(data.room).emit('writeMessage', data); // Send to all users in room, including sender

    })
    socket.on('newMessage', function (data) {
       //socket.broadcast.to(data.room).emit('receiveMessage', data)
      socket.to(data.room).emit('receiveNewMessage', data); 
 
    })
    socket.on("disconnect", () => {
      socket.leave(data.room);
      console.log("leaveChat" + data);
      socket.to(data.room).emit("userLeave", data.id);
    });
  })


});

