
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
  app.set('views', __dirname + '/views')
})

app.error(function(err, req, res, next){
  console.dir(err)
  if (!err || 2 !== err.errno)
    return res.render("500.jade", { layout: "layout.error.jade" }, function(err, content){
      res.send(content || "Internal Server Error", 500)  
    })
  res.render("404.jade", { layout: "layout.error.jade" }, function(err, content){
    res.send(content || "File Not Found", 404)  
  })
})

require("./lib/routes")
require("./lib/sockets")

// never crash
process.on("uncaughtException", function(err){
  console.warn("caught unhandled exception:")
  console.warn(err.stack || err)    
})
