;(function(io, toString){

  io.setPath("/js/socketio/")
  
  var global = window
    , room = global.room = {}

  // generate internal uids
  var gnid = (function(uid){ 
    return function(){
      return ++uid + "_" + new Date
    }
  })(0)

  // event register
  var evts = room.evts = {}

  var socket = room.socket = new io.Socket(location.hostname)
  socket.connect()
  socket.on("message", function(message){
    // decode message and trigger events.
    // we don't use JSON.parsing, it's too slow
    // Emit all sent events with room.trigger()
    var msg = message.split("|")
      , tok

    while (tok = msg.shift()){
      tok = tok.split("#")
      room.trigger(tok[0], tok.length > 1 ? tok[1].split(",") : [])
    }
  })

  /**
   * Encodes and sends events and their arguments to the server
   *
   * We're not using JSON.stringify which limits the type of data we
   * can send but we get speed gains necessary for real time games.
   *
   * Example:
   *
   *    room.send(
   *    { "jump": [200, 430, 0.43266]
   *    , "say": "how's it going?"
   *    })
   *
   *    // other players will receive two events, `jump` and `say`
   *    // which are triggered on `room`.
   *    room.trigger("jump", [200, 430, 0.43266])
   *    room.trigger("say", ["how's it going?"])
   *
   * @param {object} events
   * @return undefined
   *
   */

  room.send = function(events){
    if (!events) return
    var encoded = ""
      , event
    for (event in events){
      encoded += event + "#" + events[event] + "|"
    }
    socket.send(encoded)
  }

  /**
   * Tells the server we'd like to join a gameroom.
   *
   * @return undefined
   *
   */

  room.join = function(){
    socket.send("join")
  }

  /**
   * Binds event listeners
   *
   * Events arriving from the server will trigger the
   * handlers registered with `room.bind()`
   *
   * `names` is an event name or space seperated list of
   * event names to which `handler` will be bound.
   *
   * Example:
   *
   *    // fn will be bound to both jump and say events
   *    room.bind("jump say", function(eventName){
   *      room.log(eventName)
   *    })
   *
   * @param {String} names
   * @param {Function} handler
   * @returns undefined
   *
   */

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

  /**
   * Removes event listeners
   *
   * The inverse of `room.bind()`. 
   *
   * `names` is an event name or space seperated list of
   * event names from which `fn` should be removed.
   *
   * `fn` is the function to remove. If `fn` is not passed
   * all listeners for the specified event name(s) are removed.
   *
   * Example:
   *    
   *    room.unbind("jump say") // all listeners to these two events are removed
   *    room.unbind("jump", func) // only func stops listening to "jump"
   *
   * @param {String} names
   * @param {Function} fn
   * @returns undefined
   *
   */

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

  /**
   * Fires event `name` with the given `args`
   *
   * @param {String} name
   * @param {Array} args
   * @returns undefined
   *
   */

  room.trigger = function(name, args){
    if (!(name && args && evts[name])) return
    
    var handlers = evts[name]
      , len = handlers.length

    while (len--)
      handlers[len].apply(room, [name].concat(args))
  }
 

  // - helpers

  // cross browser happiness
  room.log = console && "function" == typeof console.log
    ? function(){ console.log.apply(console, arguments) }
    : function(){}


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

})(io, Object.prototype.toString)
