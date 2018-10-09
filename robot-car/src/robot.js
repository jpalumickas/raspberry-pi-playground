const five = require('johnny-five');
const Raspi = require('raspi-io');
const PiIO = require('pi-io');
const EventEmitter = require('events');

const config = require('./config');

class Robot {
  constructor() {
    this.boards = undefined;

    this.initBoards();
    this.events = new EventEmitter();
  }

  initBoards() {
    const that = this;
    const boards = new five.Boards(
      [
        {
          id: 'main',
          io: new Raspi({
            enableSoftPwm: true,
            enableSerial: false, // We use Bluetooth so we need to disable Serial
          }),
          repl: false,
        },
        {
          id: 'piio',
          io: new PiIO({}),
          repl: false,
        }
      ]
    );

    boards.on('ready', function() {
      that.boards = this;
      that.initMotors();
      that.initServo();
      that.initProximity();
      that.afterLoad();

    });

    boards.byId('main').on('exit', () => {
      that.stopMotors();
      that.moveServoCenter();
    });
  }

  on(event, callback) {
    this.events.on(event, callback);
    return this;
  }

  // Motors

  motors() {
    return this.motors;
  }

  leftMotor() {
    return this.motors[0];
  }

  rightMotor() {
    return this.motors[1];
  }

  stopMotors() {
    this.motors.brake();
    this.motors.stop();
  }

  move(leftSpeed = 0, rightSpeed = 0) {
    if (leftSpeed >= 0) {
      this.leftMotor().forward(leftSpeed);
    } else if (leftSpeed < 0) {
      this.leftMotor().reverse(leftSpeed * -1);
    }

    if (rightSpeed >= 0) {
      this.rightMotor().forward(rightSpeed);
    } else if (rightSpeed < 0) {
      this.rightMotor().reverse(rightSpeed * -1);
    }
  }

  // Servo

  moveServoLeft() {
    this.servo.stop();
    this.servo.max();
  }

  moveServoRight() {
    this.servo.stop();
    this.servo.min();
  }

  moveServoCenter() {
    this.servo.stop();
    this.servo.center();
  }

  stopServo() {
    this.servo.stop();
  }

  // Init

  initMotors() {
    this.motors = new five.Motors([
      { pins: config.pins.leftWheel },
      { pins: config.pins.rightWheel },
    ]);
  }

  initServo() {
    this.servo = new five.Servo(config.pins.servo);
  }

  initProximity() {
    this.proximity = new five.Proximity({
      controller: PiIO.HCSR04, // Custom controller
      triggerPin: config.pins.proximity.trigger,
      echoPin: config.pins.proximity.echo,
      board: this.boards.byId('piio'),
      freq: 200,
    });
  }

  afterLoad() {
    this.motors.stop();
    this.motors.brake();
    this.servo.center();
    this.events.emit('ready', this);

    const that = this;
    this.proximity.on('change', function() {
      if (parseInt(this.cm, 10) <= 0) {
        // Invalid metric
        return;
      }

      that.events.emit('distance', this.cm);
    });
  }
}

module.exports = Robot;
