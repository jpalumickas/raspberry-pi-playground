const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');

class HttpServer {
  constructor() {
    this.events = new EventEmitter();

    this.loadServer();
    this.loadSockets();
  }

  loadServer() {
    this.server = http.createServer((req, res) => {
      fs.readFile(__dirname + '/http-server/public/index.html', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          return res.end("404 Not Found");
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);

        return res.end();
      });
    });

    this.server.listen(8080);
  }

  on(event, callback) {
    this.events.on(event, callback);
    return this;
  }

  move({ leftSpeed, rightSpeed }) {
    this.events.emit('move', { leftSpeed, rightSpeed });
  }

  loadSockets() {
    this.io = require('socket.io')(this.server);

    this.io.sockets.on('connection', (socket) => {
      socket.on('forward', () => {
        console.log('Forward!')
        this.move({ leftSpeed: 255, rightSpeed: 255 });
      });

      socket.on('back', () => {
        console.log('Back!')
        this.move({ leftSpeed: -255, rightSpeed: -255 });
      });

      socket.on('left', () => {
        console.log('Left!')
        this.move({ leftSpeed: -255, rightSpeed: 255 });
      });

      socket.on('right', () => {
        console.log('Right!')
        this.move({ leftSpeed: 255, rightSpeed: -255 });
      });

      socket.on('stop', (data) => {
        console.log('Stop!')
        this.move({ leftSpeed: 0, rightSpeed: 0 });
      });
    });
  }

  updateDistance(distance) {
    this.io.emit('distance', distance);
  }
}

module.exports = HttpServer;
