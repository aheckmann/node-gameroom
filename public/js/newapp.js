;(function($){
  room.encode = function(message){
    // { event: [array of args], event: [array of args] }
    // "EVENT_NAME#arg1,arg2,arg3,..|EVENT_NAME|..."
    if (!message) return
    var encoded = ""
      , event
    for (event in message){
      encoded += event + "#" + message[event] + "|"
    }
    return encoded
  }

  room.decode = function(message){
    //console.log(message)
    // don't use JSON.parsing, too slow
    // "jump#40,400,60|punch|gameover"
    // "EVENT_NAME#arg1,arg2,arg3,..|EVENT_NAME|..."
    // Emit all server events on $(document)
    var msg = message.split("|")
      , doc = room.doc
      , tok
    while (tok = msg.shift()){
      tok = tok.split("#")
      doc.trigger(tok[0], tok.length > 1 ? tok[1].split(",") : [])
    }
    // return false to tell the decoder that we handled it
  }

})(jQuery)
