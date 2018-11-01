const _isEqual = require('lodash/isEqual');
const DualShockController = require('./src/controllers/dualshock');
const HttpServerController = require('./src/controllers/http-server');
const config = require('./src/config');
const Robot = require('./src/robot');

const dualshock = new DualShockController();
const httpServer = new HttpServerController();
const robot = new Robot();

let state = {
  distance: 0,
  leftSpeed: 0,
  rightSpeed: 0,
};

const setState = (obj) => {
  state = Object.assign({}, state, obj);
  return state;
}

robot.on('ready', () => {
  robot.moveServoRight();

  robot.on('distance', (distance) => {
    setState({ distance });
  });

  let currentState;

  const moveInterval = setInterval(() => {
    if (_isEqual(currentState, state)) { return; }
    currentState = state;

    if (state.leftSpeed > 0 && state.rightSpeed > 0 && Math.abs(state.leftSpeed - state.rightSpeed) < 50) {
      robot.moveServoCenter();
    } else if (state.leftSpeed > state.rightSpeed) {
      robot.moveServoRight();
    } else if (state.leftSpeed < state.rightSpeed) {
      robot.moveServoLeft();
    } else {
      robot.moveServoCenter();
    }

    if (state.leftSpeed > 0 || state.rightSpeed > 0) {
      if (parseInt(state.distance, 10) <= 10) {
        robot.stopMotors();
        dualshock.rumble();
        return;
      } else if (parseInt(state.distance, 10) <= 15) {
        state.leftSpeed = Math.min(70, state.leftSpeed);
        state.rightSpeed = Math.min(70, state.rightSpeed);
      } else if (parseInt(state.distance, 10) <= 25) {
        state.leftSpeed = Math.min(127, state.leftSpeed);
        state.rightSpeed = Math.min(127, state.rightSpeed);
      }
    }

    robot.move(state.leftSpeed, state.rightSpeed);
  }, 100);

  dualshock.on('ready', () => {
    dualshock.on('move', setState);
  });

  httpServer.on('move', setState);
});
