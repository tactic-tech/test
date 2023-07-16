const express = require('express')
app = express()
const { v4: uuidV4, stringify } = require('uuid')
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



  //conversation one to one room

  let conversationRoomName = "";
  let conversationRoomUsers = [];
  socket.on('joinConversation', function (data) {

    conversationRoomName = data.room;
 
    const userData = data.user;

    if (!conversationRoomUsers.find((item) =>
      item.user.id === userData.id && item.room === conversationRoomName)) {
        socket.join(data.room) 
         conversationRoomUsers.filter((child)=>{
          parseInt(child.user.id) === userData.id
          socket.leave(child.room)
        } );
        conversationRoomUsers.push({ id: socket.id, user: userData, room: conversationRoomName })
    }
    // conversationRoomUsers = conversationRoomUsers.filter(child => parseInt(child.user.id) !== userData.id);
    //    socket.join(data.room)
    //     conversationRoomUsers.push({ id: socket.id, user: userData, room: conversationRoomName })

    console.log("chatroom_users" + JSON.stringify(conversationRoomUsers));
    console.log("chatroom_users" + conversationRoomUsers.length);
    socket.on("userJoin", (data) => {
      console.log("userJoin" + data);
    });

    socket.on('typeMessage', function (data) {
      socket.to(data.room).emit('writeMessage', data); // Send to all users in room, including sender

    })
    socket.on('newMessage', function (data) {
      //socket.broadcast.to(data.room).emit('receiveMessage', data)
      if (!conversationRoomUsers.find((item) =>
        item.user.id === data.conversation_with && item.room === data.conversation)) {
        socket.to(data.room).emit('receiveNewMessage', data);
      } else {
        socket.broadcast.emit('notification_' + data.conversation_with, { data: data, type: 'conversation' });
      }

    })
    socket.on("disconnect", () => {
      socket.leave(data.room);
      console.log("leaveChat" + data);
      socket.to(data.room).emit("userLeave", data.id);
    });
  })


});

