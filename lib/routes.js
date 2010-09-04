var app = module.parent.exports

app.get('/', function(req, res){
  res.render('index.jade'
  , { locals: 
      { name: "node-gameroom" 
      , pageClass: "index"
      }
    }
  )
})

app.get('/room', function(req, res){
  res.render('room.jade'
  , { layout: "layout.game.jade"
    , locals: 
      { name: "playing a game" 
      , pageClass: "room"
      }
    }
  )
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

