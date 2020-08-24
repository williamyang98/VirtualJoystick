## Explanation
Uses [vJoy](http://vjoystick.sourceforge.net/site/index.php/download-a-install/download) to emulate a virtual joystick. Python is used to the load the vJoy dll, and communicates with a react web app to recieve joystick commands from a website. This can run on any phone or desktop.

### Running build
```bash
cd controller
python3 main.py
# CTRL-C to terminate
# go to your localaddress to get ui
# E.g. localhost:3000, 192.168.x.x:3000
```

### Basic UI
![alt text](docs/phone_ui_v3.jpg "UI Phone App")
Basic proof of concept for Microsoft Flight Simulator 2020.

### Changing UI
UI is written using ReactJS. Run below commands to start development server.
```bash
cd web/vjoy
# OPTIONAL: install npm modules
# You need yarn and node for this
yarn install
# run the development server for react website
yarn start
# build the website once you are done
yarn build
```
