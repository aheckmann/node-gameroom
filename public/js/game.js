;(function($, io, toString){

  io.setPath("/js/socketio/")

  // the flash transport whines if sending msgs too fast
  // but we seem to be able to safely ignore those
  if (console && "function" == typeof console.error){
    var __err = console.error;
    console.error = function(err){
      if (~(""+err).indexOf("Error: You are tr"))
        return;
      __err(err)
    }
  }
  
  var global = window
    , room = global.room = {}

  room.doc = $(document)

  socket = room.socket = new io.Socket(location.hostname)
  socket.connect()
  socket.on("message", function(message){
    var decoded = room.decode ? room.decode(message) : message
    // devs can return false from room.decode to specify
    // that they handled everything so we don't have to
    if (false === decoded) return
    room.doc.trigger("message", decoded)
  })

  // cross browser happiness
  room.log = console && "function" == typeof console.log
    ? function(){ console.log.apply(console, arguments) }
    : function(){}

  room.send = function(events){
    // room.encode allows devs to specify their own encoding
    events = room.encode ? room.encode(events) : events
    socket.send(events)
  }
  

})(jQuery, io, Object.prototype.toString)
