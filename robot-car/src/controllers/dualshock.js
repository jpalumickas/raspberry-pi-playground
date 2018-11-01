const dualshock = require('dualshock');
const EventEmitter = require('events');

const normalizeXY = ({ x, y }) => {
  const normalize = (val) => {
    if (val > 127) {
      const value = val - 128;
      return ((255 / 127) * value) * -1;
    } else if (val < 127) {
      const value = (val - 127);
      return ((255 / 127) * value) * -1;
    } else {
      return 0;
    }
  }

  return { x: Math.round(normalize(x) * -1), y: Math.round(normalize(y)) };
}

const handleDirection = ({ x, y }) => {
  let leftDirection = 'forward';
  let rightDirection = 'forward';
  let leftSpeed = 0;
  let rightSpeed = 0;

  if (y > 0) { // Forward
    leftSpeed = y;
    rightSpeed = y;
    if (x < -40) {
      rightSpeed = 255;
      leftSpeed = x + 255;
      if (x < -200) {
        leftDirection = 'reverse';
        leftSpeed = x * -1;
      }
    }
    if (x > 40) {
      if (x > 200) {
        leftSpeed = 255;
        rightpeed = x;
        rightDirection = 'reverse';
      } else {
        leftSpeed = 255;
        rightSpeed = 255 - x;
      }
    }
  } else if (y < 0) { // Back
    leftDirection = 'reverse';
    rightDirection = 'reverse';
    leftSpeed = y * -1;
    rightSpeed = y * -1;
  }

  return {
    leftDirection,
    rightDirection,
    leftSpeed,
    rightSpeed,
  };
};

const handleSimpleDirection = ({x, y }) => {
  let leftSpeed = 0;
  let rightSpeed = 0;

  if (y > 150) {
    leftSpeed = 255;
    rightSpeed = 255;
  } else if (y < -150) {
    leftSpeed = -255;
    rightSpeed = -255;
  } else if (x < -150) {
    leftSpeed = -255;
    rightSpeed = 255;
  } else if (x > 150) {
    leftSpeed = 255;
    rightSpeed = -255;
  }

  return {
    leftSpeed,
    rightSpeed,
  };
}

class DualShockController {
  constructor() {
    this.events = new EventEmitter();
  }

  loadDevice() {
    console.log('Loading PS4 DualShock controller...');
    this.loadDeviceInterval = setInterval(() => {
      this.devices = dualshock.getDevices();
      this.device = this.devices[0];
      console.log('Trying to connect to PS4 DualShock controller...');
      if (this.device) {
        this.initDevice();
        clearInterval(this.loadDeviceInterval);
        this.events.emit('ready', this.gamepad);
        console.log('PS4 DualShock controller ready.');
      }
    }, 1000);
  }

  initDevice() {
    this.gamepad = dualshock.open(this.device, {
      smoothAnalog: 10,
      smoothMotion: 15,
      joyDeadband: 4,
      moveDeadband: 4
    });

    this.initOnUpdate();
  }

  on(event, callback) {
    this.events.on(event, callback);

    if (event === 'ready') {
      this.loadDevice();
    }

    return this;
  }

  gamepad() {
    return this.gamepad;
  }

  rumble() {
    if (!this.device) { return; }
    if (!this.gamepad) { return; }

    clearInterval(this.rumbleInterval);
    this.gamepad.rumbleAdd(20, 20);
    this.rumbleInterval = setTimeout(() => {
      this.rumbleStop();
    }, 300);
  }

  rumbleStop() {
    if (!this.device) { return; }
    if (!this.gamepad) { return; }

    this.gamepad.rumble(0, 0);
  }

  initOnUpdate() {
    const that = this;
    this.gamepad.onupdate = function(changed) {
      if (changed.lStickX || changed.lStickY) {
        const { x, y } = normalizeXY({ x: this.analog.lStickX, y: this.analog.lStickY });
        const state = handleSimpleDirection({ x, y });
        that.events.emit('move', state);
      }
    }
  }
};

module.exports = DualShockController;
