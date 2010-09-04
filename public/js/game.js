;(function($, io, toString){

  io.setPath("/js/socketio/")
  
  var global = window
    , room = global.room = {}

  room.doc = $(document)

  var socket = room.socket = new io.Socket(location.hostname)
  socket.connect()
  socket.on("message", function(message){
    //console.log(message)
    // we don't use JSON.parsing, it's too slow
    // for realtime solutions
    // Emit all sent events on $(document)
    var msg = message.split("|")
      , doc = room.doc
      , tok
    while (tok = msg.shift()){
      tok = tok.split("#")
      doc.trigger(tok[0], tok.length > 1 ? tok[1].split(",") : [])
    }
  })

  // skip json.stringify and use custom format
  // more restricted but faster. IMO, speed wins the
  // debate for realtime solutions
  room.send = function(events){
    // { event: [array of args], event: [array of args] }
    // "EVENT_NAME#arg1,arg2,arg3,..|EVENT_NAME|..."
    if (!events) return
    var encoded = ""
      , event
    for (event in events){
      encoded += event + "#" + events[event] + "|"
    }
    socket.send(encoded)
  }
 
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

  // cross browser happiness
  room.log = console && "function" == typeof console.log
    ? function(){ console.log.apply(console, arguments) }
    : function(){}

})(jQuery, io, Object.prototype.toString)
