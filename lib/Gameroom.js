var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , encode = require("./utils/encode")
  , cpyary = require("./utils/cpyary")
  , Player = require("./Player")
  , assert = require("assert")
  , sys = require("sys")

const DEFAULT_MAX_PLAYERS = 0xfffffffff
const DEFAULT_MIN_PLAYERS = 2
const DEFAULT_COUNTDOWN_DURATION = 0

var STATUS = module.exports.STATUS = 
{ QUEUED: 0
, COUNTDOWN: 1
, INPROGRESS: 2
, OVER: 3 
}

var Gameroom = module.exports.Gameroom = function(options){
  console.log("new Gameroom")

  assert.ok(options.duration)

  this.DURATION = options.duration
  this.MAX_PLAYERS = options.maxplayers || DEFAULT_MAX_PLAYERS
  this.MIN_PLAYERS = options.minplayers || DEFAULT_MIN_PLAYERS
  this.PREGAME_COUNTDOWN_DURATION = options.countdown || DEFAULT_COUNTDOWN_DURATION
  this.status = STATUS.QUEUED
  this.id = uid()
  this.players = []
  this._periodicals = {}
}
Gameroom.prototype.__proto__ = EventEmitter.prototype


Gameroom.prototype.add = function(player){
  console.log("Gameroom.add")

  assert.ok(player instanceof Player)

  this.players.push(player)

  player.on("quit", this.remove.bind(this, player))
  player.on("event", this.notify.bind(this))
  player.on("gameover", this.end.bind(this))

  this.notify(
  { method: "gamejoin"
  , args: this.players.map(function(player){ return player.uid }) 
  })

  if (STATUS.QUEUED === this.status && this.MIN_PLAYERS === this.players.length)
    this.countdown()
  else if (this.MAX_PLAYERS === this.players.length)
    this.start()
}

Gameroom.prototype.remove = function(who){
  var players = this.players
    , len = players.length
    , whouid = who.uid
    , player
  while (len-- && (player = players[len])) if (player.uid == whouid){
    players.splice(len, 1)
    player.removeAllListeners("quit")
    this.emit("remove", player, players.length)
    console.log("player removed (%s)", whouid)
    if (STATUS.COUNTDOWN === this.status && players.length < this.MIN_PLAYERS){
      self.periodiclyNotifyStop("gamecountdown")
      this.status = STATUS.QUEUED
      this.emit("requeued")
    }
    console.log("remaining players in Gameroom: " + players.length)
    break
  }
  return who
}

// starts the Gameroom countdown
Gameroom.prototype.countdown = function(){
  if (0 === this.PREGAME_COUNTDOWN_DURATION)
    return this.start()

  console.log("Gameroom.countdown")

  this.status = STATUS.COUNTDOWN
  this.emit('countdownStart')
  var start = this.start.bind(this)

  // sync the countdown clock
  this.periodiclyNotify(
  { method: "gamecountdown"
  , times: this.PREGAME_COUNTDOWN_DURATION
  , howOften: 1000
  , onTick: function(times){
      console.log("game countdown: (%d)", times)
    }
  , onComplete: function(){
      setTimeout(start, 1000)
    }
  })
}

Gameroom.prototype.periodiclyNotifyStop = function(method){
  if (this._periodicals[method])
    clearInterval(this._periodicals[method])
}

Gameroom.prototype.periodiclyNotify = function(options){
  var method = options.method
    , onTick = options.onTick
    , args = options.args || []
    , times = options.times || 1
    , howOften = options.howOften
    , onComplete = options.onComplete
    , self = this

  if (!method) throw new Error("`method` is required");
  if (!howOften) throw new Error("`howOften` is required");
  
  this.periodiclyNotifyStop(method)

  self._periodicals[method] = setInterval(function(){
    var ary = cpyary(args)
    ary.push(times)
    self.notify({ method: method, args: ary })
    onTick && onTick(times)
    if (!--times) {
      clearInterval(self._periodicals[method])
      onComplete && onComplete()
    }
  }, howOften)

}

// starts the Gameroom
Gameroom.prototype.start = function(){
  console.log("Gameroom.start")

  this.status = STATUS.INPROGRESS 
  this.periodiclyNotifyStop("gamecountdown")

  this.add = function(){ 
    console.warn("Tried adding player to a Gameroom in progress!")
  }

  // Notify all players that Gameroom has started
  this.notify({ method: "gamestart" })
  this.emit('start')

  this.periodiclyNotify(
  { method: "gametimer"
  , howOften: 1000
  , times: this.duration 
  , onComplete: this.end.bind(this)
  })
}

// broadcasts msg to all players
Gameroom.prototype.notify = function(msg, eventSource){
  var players = this.players
    , len = players.length
  while (len--) if (players[len] != eventSource) {
    players[len].send(encode(msg))
  }
}

// ends the game
Gameroom.prototype.end = function(){
  console.log("Gameroom.end")
  this.periodiclyNotifyStop("gametimer")
  this.status = STATUS.OVER
  this.notify({ method: "gamestatus", args: ["gameover"] } )
  this.emit('end', this.players)
}


