var port     = 1337;
var title    = 'Webchat';
var messages = [{'username': 'Lucas Courot', 'message': 'Hello world!'}];

var http = require('http');
var url  = require('url');
var fs   = require('fs');

http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;

    // The homepage
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
    } else if (path == '/messages') { // The chat API
        response.writeHead(200, { 'Content-Type': 'application/json' });

        if (request.method.toLowerCase() == 'post') { // Add new message
            var requestBody = '';

            request.on('data', function (data) {
                requestBody += data;
            });

            request.on('end', function () {
                var newMessage = eval('(' + requestBody + ')');
                messages.unshift(newMessage);
            });

            response.write("{'errors':'Message added'}");
        } else if (request.method.toLowerCase() == 'get') { // Retrieve all the messages
            response.write(JSON.stringify(messages));
        } else {
            response.writeHead(405);
            response.end('Method not allowed');
        }

        response.end();
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('Not found.');
    }
}).listen(port);

console.log('Server running on port ' + port);
