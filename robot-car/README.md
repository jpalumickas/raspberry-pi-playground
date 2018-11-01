# 2-Wheel Car Robot

## Used

* Servo SG90
* Proximity HC-SR04 sensor
* 2 Motors
* PS4 controller

## Usage

```sh
yarn install
sudo node index.js
```

## Automatically start robot

### Create systemd service

Create a file `/etc/systemd/system/robot-car.service`

```
[Unit]
Description=Robot Car
After=network.target

[Service]
ExecStart=/usr/bin/node index.js
WorkingDirectory=/home/pi/Projects/car
StandardOutput=inherit
StandardError=inherit
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

### Control service

Enable service to run after  Raspberry Pi restart

```sh
sudo systemctl enable robot-car
```

Restart service

```sh
sudo systemctl restart robot-car
```

Tail logs

```sh
journalctl -u robot-car.service -f
```
