# Node-Gameroom

Everthing you need to get started creating realtime web-based games with nodejs.

Includes
* Express for handling your sites content
* Socket.io for mananging your games realtime events and data
* jQuery
* Tiny client-side helper lib to simplify encoding/decoding and message passing
* oAuth to let your users sign in easily

Excludes
* Any database support. The choice is yours.


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

Client-side events
* gamejoin
* gamestatus
* gamecountdown
* gamestart
* gametimer

Server-side events
// ...
