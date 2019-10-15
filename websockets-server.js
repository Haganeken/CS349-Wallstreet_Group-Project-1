var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});

var messages = [];
var current_topic = "";

console.log('websockets server started');

ws.on('connection', function (socket) {
    console.log('client connection established');

    if (current_topic) {
        socket.send("*** Topic is '" + current_topic + "'");
    }

    messages.forEach(function (msg) {
        socket.send(msg);
    });

    socket.on('message', function (data) {
        console.log('message recieved: ' + data);

        if (data.startsWith("/topic")) {
            current_topic = data.substring(7);
        } else {
            messages.push(data);
        }

        ws.clients.forEach(function (clientSocket) {
            if (data.startsWith("/topic")) {
                clientSocket.send("*** Topic has changed to '" + current_topic + "'");
            } else {
                clientSocket.send(data);
            }
        });
    })
});
