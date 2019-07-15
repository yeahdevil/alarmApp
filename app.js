 const express = require("express");
 const app = express();
 const bodyParser = require("body-parser");
 var socket = require('socket.io');
var server = app.listen(4000, function(){
   console.log('listening for requests on port 4000');
});
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
var clients = []; 
var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    socket.on("setalarm",(data)=>{
        data.socket_id = socket.id;
       clients.push(data);  
    });
    socket.on('disconnect', function(){
        console.log("Disconnected Socket " + socket.id);
        clients=[];
    });
    setInterval(intervalFunc, 1000);
 
});
function intervalFunc() {
    var date = new Date();
    var time = addZero(date.getHours()) + ":" + addZero(date. getMinutes() );
    
    if(clients.length!=0)
    {  console.log(time);
        if(clients[0].time==time)
        {
            console.log("alarm strikes "+time);
            io.to(clients[0].socket_id).emit('strike', 'done');
            clients=[];
    
        }
    }
}
function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }