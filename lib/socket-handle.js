var Gameroom = require("./Gameroom").Gameroom
  , GAMESTATUS = require("./Gameroom").STATUS
  , Player = require("./Player")
  , queued = []
  , games = []

module.exports = {
  incomingMsg: function(msg, client, app){
    console.log("recieved websocket msg: " + msg)
    msg = msg || "noop"
    console.dir(msg)
    switch(msg){
      case "join":
        addPlayer(new Player(client), app)
        break;
    }
  }
, disconnect: function(client, app){
    console.log("client " + client.sessionId + " disconnected")
  }
}

function addPlayer(player, app){
  console.log("addPlayer")
  var gameroom
  if (!queued.length){
    queued.push(gameroom = new Gameroom(app))
    gameroom.on('start', function(){
      console.log("start emitted")
      games.push(queued.pop())
    })
    gameroom.on('end', function(players){
      console.log("end emitted")
      // let the players opt in to playing again
      // wait for a "join" event again
      var player
      while (player = players.pop()){
        player.removeAllListeners("event")
        player.removeAllListeners("quit")
        player.removeAllListeners("gameover")
        ;(function(player){
          var client = player.client
          player.client = null
          client.on("message", function(msg){
            module.exports.incomingMsg(msg, client)
          })
        })(player)
      }
      gameroom = null
    })
  }
  else gameroom = queued[0]

  gameroom.add(player)
}

