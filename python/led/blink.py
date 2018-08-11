import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(18, GPIO.OUT)

while True:
    print "led on"
    GPIO.output(18, GPIO.HIGH)
    time.sleep(0.1)
    print "led off"
    GPIO.output(18, GPIO.LOW)
    time.sleep(0.1)
