# Node-Gameroom
My basic starter kit for creating realtime web-based games with nodejs.

  Includes

  - Bugs - this is alpha baby!
  - Express for handling your sites content
  - Socket.io for mananging your games realtime events and data
  - jQuery
  - Tiny client-side helper lib to simplify encoding/decoding and message passing

  Excludes

  - Any database support. The choice is yours.


## Serverside
// ...


## Clientside

There is a global room object you can use to send events back to the server
and notify the other players etc.

room.send(message) Encodes message and sends it to server 

room.log A typical safe cross-browser logger

room.doc A cached referrence to jQuery(document)

Received messages are auto decoded and triggered on document so you can simply bind to them: jQuery(document).bind("gamestart", fn)


## Events

There are a number of Node-Gameroom provided events to help you get your games started.

  - Client-side events
    - gameplayerid(uid) 
      - uid: unique id of the current player
    - gamejoin(uid, totalPlayers)
      - uid: unique id of player that just joined (could be same as gameplayerid)
      - totalPlayers: total number of players in the gameroom
    - gamecountdown(count)
      - count: (int)
    - gamestart
    - gametimer(timer)
      - timer: (int) sent once per second
    - gameover

  - Server-side events
    - // ...


If you want to track the number of players in a gameroom, just listen for the `gamejoin` event. Every player that joins

## License 

(The MIT License)

Copyright (c) 2010 [Aaron Heckmann](aaron.heckmann+github@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
