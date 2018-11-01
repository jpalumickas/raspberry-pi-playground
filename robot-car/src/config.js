const config = {
  pins: {
    leftWheel: {
      dir: 'GPIO27',
      cdir: 'GPIO22',
      pwm: 'GPIO5',
    },
    rightWheel: {
      dir: 'GPIO26',
      cdir: 'GPIO19',
      pwm: 'GPIO6',
    },
    servo: 'GPIO25',
    proximity: {
      trigger: 'GPIO20',
      echo: 'GPIO21',
    },
  },
};

module.exports = config;
