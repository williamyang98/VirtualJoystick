import React, { useContext, useState } from 'react';
import logo from './logo.svg';
import AppContext, { AppProvider } from './AppContext';
import './App.css';
import { JoyStick } from './JoyStick';
import preventDoubleTapZoom, { PreventZoom } from './PreventZoom';
import { openFullscreen, closeFullscreen } from './Fullscreen';


class Controller {
  constructor() {
    this.connect();
  }

  connect() {
    this.ws = new WebSocket("ws://192.168.2.101:8765");
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = () => {
      this.send(new Uint8Array([0xFF]));
    }
  }

  send(p) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(p);
    }  
    if (this.ws.readyState == this.ws.CLOSED) {
      console.log("Reconnecting to websocket");
      this.connect();
    }
  }

  on_axis(v, group) {
    let p = new Uint8Array(new Float32Array([v]).buffer);
    const group_ids = {
      'x': 0x83,
      'y': 0x84,
      'z': 0x85,
      'rx': 0x86,
      'ry': 0x87,
      'rz': 0x88,
      'sl0': 0x89,
      'sl1': 0x90,
    };
    let id = group_ids[group];
    this.send(new Uint8Array([id, ...p]));
  }

  on_button_press(id) { 
    this.send(new Uint8Array([0x81, id & 0xff])) 
  }

  on_button_release(id) {
    this.send(new Uint8Array([0x82, id & 0xff])) 
  }
}

function App() {
  let ctl = new Controller();

  function tilt(x, y) {
    let p = new Uint8Array(new Float32Array([x, y]).buffer);
    ctl.send(new Uint8Array([0xAF, ...p]));
  }

  function listen_gyroscope() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", (ev) => {
          tilt(ev.beta, ev.gamma);
      }, true);
    } else if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (ev) => {
          tilt(ev.accelerationIncludingGravity.x, ev.accelerationIncludingGravity.y);
      }, true);
    } else {
      setTimeout(() => tilt(-1, -1), 1000);
    }
  }

  listen_gyroscope();

  return (
    <AppProvider value={ctl}>
      <div className="container" onTouchStart={preventDoubleTapZoom}>
        <div className="left-panel">
          <JoyStick xg='x' yg='y' pwidth={250} pheight={250}></JoyStick>
          <Slider axis='sl0' text='spoilers' snap={false} step={1}></Slider>
          <div>
            <Button id={22} text="PT Up"></Button>
            <Button id={23} text="PT Down"></Button>
          </div>
        </div>
        <div className="mid-panel">
          <JoyStick xg='rx' yg='ry' pwidth={200} pheight={200} snap={true}></JoyStick>
          <div>
            <Button id={15} text="Reset Camera"></Button>
            <Button id={16} text="Ext Camera"></Button>
            <Button id={13} text="Menu"></Button>
            <Button id={14} text="Alt"></Button>
            <Button id={17} text="Map"></Button>
            <Button id={18} text="Drone"></Button>
            <div>
              <label>Instruments</label>
              <Button id={19} text="Prev"></Button>
              <Button id={20} text="Next"></Button>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <Slider axis='z' text='rudder' step={1}></Slider>
          <Slider axis='rz' text='flaps' snap={false} step={10}></Slider>
          <div style={{textAlign: 'center'}}>
            <Button id={12} text="Flaps Up"></Button>
            <Button id={2} text="Flaps Down"></Button>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button id={3} text="Gear"></Button>
            <Button id={4} text="Brakes"></Button>
            <Button id={5} text="PBrakes"></Button>
          </div>
          <Slider axis='sl1' text='eng' snap={false} step={1}></Slider>

          <div style={{textAlign: 'center'}}>
            <Button id={6} text="Y"></Button>
            <div>
              <Button id={7} text="X"></Button>
              <Button id={8} text="B"></Button>
            </div>
            <Button id={9} text="A"></Button>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button id={10} text="Select"></Button>
            <Button id={11} text="Start"></Button>
            <Button id={21} text="AI Pilot"></Button>
          </div>

          <div style={{marginTop: "10px", float: 'right'}}>
            <button onClick={openFullscreen}>O</button>
            <button onClick={closeFullscreen}>X</button>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

function Slider({axis, text, snap=true, step=10}) {
  const ctl = useContext(AppContext);
  const [value, set_value] = useState(50);
  const [_snap, set_snap] = useState(snap);

  function on_change(ev) {
    let v = ev.target.value/100;
    ctl.on_axis(v, axis);
    set_value(ev.target.value);
  }

  function reset() {
    ctl.on_axis(0.5, axis);
    set_value(50);
  }
  
  function on_release() {
    if (_snap) {
      reset();
    }
  }

  function toggle_snap() {
    if (_snap) {
      set_snap(false);
    } else {
      set_snap(true);
      reset();
    }
  }

  return (
    <div>
      <input type='range' value={value} max={100} min={0} step={step} 
             onChange={on_change}
             onMouseUp={on_release}
             onTouchEnd={on_release}>
      </input>
      {text && <button onClick={toggle_snap}>{text + (!_snap ? "*" : "")}</button>}
    </div>);
}

function Button({id, text}) {
  const ctl = useContext(AppContext);

  return (
    <button 
      onMouseDown={() => ctl.on_button_press(id)} onMouseUp={() => ctl.on_button_release(id)}
      onTouchStart={() => ctl.on_button_press(id)} onTouchEnd={() => ctl.on_button_release(id)}
      style={{margin: '5px'}}
    >{text}
    </button>
  );
}

export default App;
