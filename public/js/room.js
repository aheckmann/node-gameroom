;(function(io, toString){

  io.setPath("/js/socketio/")
  
  var global = window
    , room = global.room = {}

  var socket = room.socket = new io.Socket(location.hostname)
  socket.connect()
  socket.on("message", function(message){
    // we don't use JSON.parsing, it's too slow
    // Emit all sent events with room.trigger()
    var msg = message.split("|")
      , tok

    while (tok = msg.shift()){
      tok = tok.split("#")
      room.trigger(tok[0], tok.length > 1 ? tok[1].split(",") : [])
    }
  })

  // skip json.stringify and use custom format
  // more restricted but faster. IMO, speed wins the
  // debate for realtime solutions
  // { event: [array of args], event: [array of args] }
  // "EVENT_NAME#arg1,arg2,arg3,..|EVENT_NAME|..."
  room.send = function(events){
    if (!events) return
    var encoded = ""
      , event
    for (event in events){
      encoded += event + "#" + events[event] + "|"
    }
    socket.send(encoded)
  }

  // tell the server we'd like to join a game room
  room.join = function(){
    // yes, socket.send not room.send. once joined, then room.send is always used.
    // todo, clean that up
    socket.send("join")
  }

  // generate uids
  var gnid = (function(uid){ 
    return function(){
      return ++uid + "_" + new Date
    }
  })(0)

  // register a handler for events pushed down from the server
  var evts = room.evts = {}

  // bind a listener for server sent events
  room.bind = function(names, handler){
    if (!(names && handler)) return

    var events = names.split(" ")
      , len = events.length
      , name
      , evt

    while (len--){
      name = events[len]
      evt = evts[name] || (evts[name] = [])
      handler._id = handler._id || gnid()
      evt.push(handler)
    }
  }

  // unregister handlers 
  // `names` is a space seperated string of event names
  // fn is a function to unregister - if omitted removes all handlers for given event name
  // unbind(name) - unregister all handlers for name
  // unbind(name, fn) - unregister fn from name
  room.unbind = function(names, fn){
    var events = names.split(" ")
      , len = events.length
      , all = !fn
      , handlers
      , handler
      , hlen
      , name

    while (name = events[--len]) if (evts[name]){
      if (all){
        evts[name] = null
        continue
      }

      handlers = evts[name]
      hlen = handlers.length

      while (handler = handlers[--hlen]) if (handler._id == fn._id){
        handlers.splice(hlen, 1)
      }

    }
  }

  // fire a `name` event with arguments `args`
  room.trigger = function(name, args){
    if (!(name && args && evts[name])) return
    
    var handlers = evts[name]
      , len = handlers.length

    while (len--)
      handlers[len].apply(room, [name].concat(args))
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

})(io, Object.prototype.toString)
