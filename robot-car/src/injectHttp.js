const http = require('http');
const fs = require('fs');

const injectHttp = ({ move } ) => {
  const server = http.createServer((req, res) => {
    fs.readFile(__dirname + '/injectHttp/public/index.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end("404 Not Found");
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);

      return res.end();
    });
  });

  server.listen(8080);

  const io = require('socket.io')(server);

  io.sockets.on('connection', (socket) => {
    socket.on('forward', () => {
      console.log('Forward!')
      move('forward');
    });

    socket.on('back', () => {
      console.log('Back!')
      move('reverse');
    });

    socket.on('left', () => {
      console.log('Left!')
      move('left');
    });

    socket.on('right', () => {
      console.log('Right!')
      move('right');
    });

    socket.on('stop', (data) => {
      console.log('Stop!')
      move('stop');
    });
  });

  const updateDistance = (distance) => {
    io.emit('distance', distance)
  }


  return {
    updateDistance,
  }
}

module.exports = injectHttp;
