const injectHttp = require('./src/injectHttp');
const DualShock = require('./src/dualshockController');
const config = require('./src/config');

const dualshock = new DualShock();

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

let distance = 0;

boards.on('ready', function() {
  const motors = new five.Motors([
    { pins: config.pins.leftWheel },
    { pins: config.pins.rightWheel },
  ]);

  const leftMotor = motors[0];
  const rightMotor = motors[1];

  const servo = new five.Servo(config.pins.servo);
  const proximity = new five.Proximity({
    controller: PiIO.HCSR04, // Custom controller
    triggerPin: config.pins.proximity.trigger,
    echoPin: config.pins.proximity.echo,
    board: this.byId('piio'),
    freq: 200,
  });

  proximity.on("change", function() {
    if (parseInt(this.cm, 10) <= 0) {
      // Invalid metric
      return;
    }

    distance = this.cm;
  });

  motors.stop();
  motors.brake();
  servo.center();

//  let leftSpeed = 255;
//  let rightSpeed = 255;

  //let speedDirection = 'up';

  //	const speedInterval = setInterval(() => {
  //	  if (speed === 255) {
  //	    speedDirection = 'down';
  //         } else if (speed === 0) {
  //	    speedDirection = 'up';
  //    }

  //	  if (speedDirection == 'up') {
  //	    speed += 5;
  //         } else if (speedDirection == 'down') {
  //	    speed -= 5;
  //         }
  //		  console.log('Speed: ', speed);
  //	}, 500);


  // let moveAction;
  // let currentAction;
  //
  // const moveInterval = setInterval(() => {
  //   if (moveAction === 'forward') {
  //     if (parseInt(distance, 10) <= 20) {
  //       moveAction = undefined;
  //       return;
  //     }
  //   }
  //
  //   if (moveAction === currentAction) { return; }
  //   currentAction = moveAction;
  //
  //   if (moveAction === 'forward') {
  //     servo.center();
  //     // servo.sweep();
  //   } else if (moveAction === 'left') {
  //     servo.max();
  //   } else if (moveAction === 'right') {
  //     servo.min();
  //   } else {
  //     servo.stop();
  //     servo.center();
  //   }
  //
  //   if (moveAction === 'forward') {
  //     leftMotor.forward(leftSpeed);
  //     rightMotor.forward(rightSpeed);
  //   } else if (moveAction === 'reverse') {
  //     leftMotor.reverse(leftSpeed);
  //     rightMotor.reverse(leftSpeed);
  //   } else if (moveAction === 'right') {
  //     leftMotor.forward(255);
  //     rightMotor.reverse(255);
  //   } else if (moveAction === 'left') {
  //     leftMotor.reverse(255);
  //     rightMotor.forward(255);
  //   } else {
  //     motors.stop();
  //     motors.brake();
  //   }
  // }, 100);
  //
  // const move = (action) => {
  //   moveAction = action;
  // }
  const directions = {
    left: 'forward',
    right: 'forward',
    leftSpeed: 0,
    rightSpeed: 0,
  };


  const moveInterval = setInterval(() => {
    if (directions.leftSpeed > 0 && directions.rightSpeed > 0 && (directions.left === 'forward' && directions.right === 'forward' && Math.abs(directions.leftSpeed - directions.rightSpeed) < 50)) {
      // servo.center();
      servo.sweep();
    } else if ((directions.leftSpeed > directions.rightSpeed) || (directions.left === 'forward' && directions.right === 'reverse')) {
      servo.stop();
      servo.min();
    } else if (directions.leftSpeed < directions.rightSpeed || (directions.left === 'reverse' && directions.right === 'forward')) {
      servo.stop();
      servo.max();
    } else {
      console.log('stop');
      servo.stop();
      servo.center();
    }

    if ((directions.left === 'forward' && directions.right === 'forward') && (directions.leftSpeed > 0 || directions.rightSpeed > 0)) {
      if (parseInt(distance, 10) <= 10) {
        motors.stop();
        motors.brake();
        dualshock.rumble();
        return;
      } else if (parseInt(distance, 10) <= 15) {
        directions.leftSpeed = Math.min(70, directions.leftSpeed);
        directions.rightSpeed = Math.min(70, directions.rightSpeed);
      } else if (parseInt(distance, 10) <= 25) {
        directions.leftSpeed = Math.min(127, directions.leftSpeed);
        directions.rightSpeed = Math.min(127, directions.rightSpeed);
      }
    }

    if (directions.leftSpeed > 0 || directions.rightSpeed > 0) {
      if (directions.left === 'reverse') {
        leftMotor.reverse(directions.leftSpeed);
      } else {
        leftMotor.forward(directions.leftSpeed);
      }

      if (directions.right === 'reverse') {
        rightMotor.reverse(directions.rightSpeed);
      } else {
        rightMotor.forward(directions.rightSpeed);
      }
    } else {
      motors.stop();
      motors.brake();
    }

  }, 100);

  const move = ({ leftDirection, rightDirection, leftSpeed, rightSpeed }) => {
    directions.left = leftDirection;
    directions.right = rightDirection;
    directions.leftSpeed = leftSpeed;
    directions.rightSpeed = rightSpeed;
  }

  const simpleMove = (action) => {
    switch(action) {
      case 'forward': {
        directions.left = 'forward';
        directions.right = 'forward';
        directions.leftSpeed = 255;
        directions.rightSpeed = 255;
        return;
      }
      case 'reverse': {
        directions.left = 'reverse';
        directions.right = 'reverse';
        directions.leftSpeed = 255;
        directions.rightSpeed = 255;
        return;
      }
      case 'right': {
        directions.left = 'forward';
        directions.right = 'reverse';
        directions.leftSpeed = 255;
        directions.rightSpeed = 255;
        return;
      }
      case 'left': {
        directions.left = 'reverse';
        directions.right = 'forward';
        directions.leftSpeed = 255;
        directions.rightSpeed = 255;
        return;
      }
      default: {
        directions.left = 'forward';
        directions.right = 'forward';
        directions.leftSpeed = 0;
        directions.rightSpeed = 0;
      }
    }
  }

	// const logInterval = setInterval(() => {
  //   console.log(`Distance: ${distance} cm.`);
	// }, 1000);

  dualshock.onMove((directions) => {
    move(directions);
  });

  const http = injectHttp({
    move: simpleMove,
  });

	setInterval(() => {
    http.updateDistance(distance);
	}, 200);


  this.byId('main').on('exit', () => {
    motors.stop();
    motors.brake();
    servo.center();
    //process.exit();
  });
});