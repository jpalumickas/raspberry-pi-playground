import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(18, GPIO.OUT)

try:
    GPIO.output(18, GPIO.LOW);
    on = False

    while True:
        input_state = GPIO.input(23)
        if input_state == False:
            print('Button Pressed')
            if on == True:
                on = False
            else:
                on = True
            time.sleep(0.2)

        if on == True:
            GPIO.output(18, GPIO.HIGH)
        else:
            GPIO.output(18, GPIO.LOW)


except KeyboardInterrupt:
        GPIO.cleanup()
