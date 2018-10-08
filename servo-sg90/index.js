const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi({
    enableSoftPwm: true
  })
});

board.on('ready', function() {
  const servo = new five.Servo('GPIO5');

  this.repl.inject({
    servo: servo,
  });
});
