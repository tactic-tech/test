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
    //spicific classroom
    socket.on('classroomNotification', function (data) {
      socket.emit('classroom_'+data.id, data );

    });
    
    socket.on('notification', function (data) {
      socket.emit('notification_'+data.reciver_id, data );
    });

    
     
  
  });
   
  
  