const express = require('express')  
 app = express()
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
     
    //reciver joinRoom 
    socket.on('notification', function (data) {
      //socket.join(data.room);
      
      //console.log("room is " + data.room)
    });
    
     
  
  });
   
  
  