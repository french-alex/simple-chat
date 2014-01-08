var http      = require('http');
var url       = require('url');
var fs        = require('fs');
var io        = require('socket.io');

var port      = 1337;
var title     = 'Webchat';
var messages  = [{'username': 'Lucas Courot', 'message': 'Hello world!'}];
var nbClients = 0;

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;

    // Homepage
    if (path == '/') {
        fs.readFile('./index.html', function (error, content) {
            if (error) {
                response.writeHead(500);
                response.end('Error');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(content, 'utf-8');
            }
        });
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('Not found.');
    }
}).listen(port);

io = io.listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('fetchMessages', messages);
    io.sockets.emit('fetchNbClients', ++nbClients);

    socket.on('newMessage', function (newMessage) {
        messages.push(newMessage);
        socket.broadcast.emit('fetchNewMessage', newMessage);
    });

    socket.on("disconnect", function(){
        io.sockets.emit('fetchNbClients', --nbClients);
    });
});

console.log('Server running on port ' + port);
