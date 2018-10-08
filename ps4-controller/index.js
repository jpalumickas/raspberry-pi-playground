const dualshock = require('dualshock');
const devices = dualshock.getDevices();

const device = devices[0];
const gamepad = dualshock.open( device, {
  smoothAnalog: 10,
  smoothMotion: 15,
  joyDeadband: 4,
  moveDeadband: 4
});

gamepad.onanalog = (axis, value) => {
  console.log(`Analog '${axis}' = ${value}`);
}
