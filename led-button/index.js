const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out');
const pushButton = new Gpio(17, 'in', 'both');

pushButton.watch(function (err, value) {
  if (err) {
    console.error('There was an error', err);
    return;
  }

  LED.writeSync(value);
});

const unexportOnClose = () => {
  LED.writeSync(0);
  LED.unexport();
  pushButton.unexport();
};

process.on('SIGINT', unexportOnClose);
