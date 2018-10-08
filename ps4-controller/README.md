# Connect Raspberry Pi with PS4 DualShock controller

## Connect Controller to Raspberry Pi

1. Make sure your OS is up to date

```sh
sudo apt-get update
sudo apt-get upgrade
```

2. Run Bluetooth command

```sh
sudo bluetoothctl
```

3. Setup agent on bluetooth

```sh
agent on
default-agent
```

4. Scan for bluetooth devices

```sh
scan on
```

5. Hold **Share** + **PS** button together on Controller to enable pairing.

6. You will see **Wrireless Controller** device in the list. You need MAC address to stat pairing.

Example output:
```sh
[NEW] Device 00:01:6C:B4:06:7E Wireless Controller
```
For this example MAC address is **00:01:6C:B4:06:7E**. You need to use your MAC address instead.

7. Connect to Controller.

If your controller stops flashing just press the **Share** and **PS** buttons again to enable pairing.

```sh
connect YOUR_MAC_ADDRESS
```

You will see something like this
```
Attempting to connect to 00:01:6C:B4:06:7E
[CHG] Device 00:01:6C:B4:06:7E Connected: yes
[CHG] Device 00:01:6C:B4:06:7E UUIDs: 00001124-0000-1000-8000-00805f9b34fb
[CHG] Device 00:01:6C:B4:06:7E UUIDs: 00001200-0000-1000-8000-00805f9b34fb
[CHG] Device 00:01:6C:B4:06:7E ServicesResolved: yes
[CHG] Device 00:01:6C:B4:06:7E Paired: yes
Connection successful
```

8. Now we need to add our MAC address to the trusted list so the PS4 controller can automatically connect to the Raspberry Pi.

```
trust YOUR_MAC_ADDRESS
```

9. Quit pairing by writing `quit`.

10. Test your device

```sh
sudo apt-get install joystick
sudo jstest /dev/input/js0
```

When you press something on controller you need to see output there.


Source: [pimylifeup.com](https://pimylifeup.com/raspberry-pi-playstation-controllers/)

## Install dependencies

```sh
sudo apt-get install build-essential git gcc-4.8 g++-4.8
export CXX=g++-4.8
sudo apt-get install libusb-1.0-0 libusb-1.0-0-dev libudev-dev
```

## Usage

```sh
yarn install
sudo node index.js
```
