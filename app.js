
require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/express/support/jade/lib/'
, __dirname + '/support/connect-auth/lib'
, __dirname + '/support/node-oauth/lib'
)

var express = require('./support/express')

var app = module.exports = express.createServer(
  express.errorHandler({ dumpExceptions: true, showStack: true})
, express.conditionalGet()
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
)

app.configure(function(){
  app.set("views", __dirname + "/views")
  app.set("game duration", 60)
  app.set("game max players", 10)
  app.set("game min players", 2)
  app.set("game countdown duration", 10)
})

require("./lib/routes")
require("./lib/sockets")

// never crash
process.on("uncaughtException", function(err){
  console.warn("caught unhandled exception:")
  console.warn(err.stack || err)    
})
