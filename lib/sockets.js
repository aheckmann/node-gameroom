var app = module.parent.exports
  , io = require("../support/socketio")
  , handle = require("./socket-handle")

// sockets 
var sock = io.listen(app)
sock.on("connection", function(client){
  client.on("message", function(msg){
    handle.incomingMsg(msg, client, app)
  })
  client.on("disconnect", function(){
    handle.disconnect(client, app)
  })
})

