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

