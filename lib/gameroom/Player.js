
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , encode = require("./utils/encode")
  , sys = require("sys")

module.exports = Player

function Player(client){
  client.removeAllListeners("message")
  client.on("message", this.handle.bind(this))
  client.on("disconnect", this.quit.bind(this))
  this.client = client
  this.__defineGetter__("uid", function(){ return client.sessionId })
  this.client.send(encode({ method: "playerid", args:[client.sessionId] }))
}
Player.prototype.__proto__ = EventEmitter.prototype


Player.prototype.send = function(msg){
  this.client.send(msg)
}

Player.prototype.quit = function(){
  console.log("No fair, I quit! (%s)", this.uid)
  this.emit("quit")
}

Player.prototype.handle = function(event){
  switch(event.method){
    case "gameover":
      this.emit("gameover")
      return;
    default:
      this.emit("event", event, this)
  }
}

