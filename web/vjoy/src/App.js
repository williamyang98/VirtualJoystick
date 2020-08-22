import React, { useContext, useState, useEffect } from 'react';
import AppContext, { AppProvider } from './AppContext';
import './App.css';
import { JoyStick } from './JoyStick';
import { toggleFullscreen, openFullscreen } from './Fullscreen';
import { Controller } from "./Controller";

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
      {/* <div className="container noselect" onTouchStart={preventDoubleTapZoom}> */}
      <div className="container noselect">
        <div className="left-panel">
          <JoyStick xg='x' yg='y' pwidth={250} pheight={250}></JoyStick>
          <Slider axis='sl0' text='spoilers' snap={false} step={1} default_value={0}></Slider>
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
              <label><small>Instruments</small></label>
              <Button id={19} text="Prev"></Button>
              <Button id={20} text="Next"></Button>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <Slider axis='z' text='rudder' step={1}></Slider>
          <Slider axis='rz' text='flaps' snap={false} step={1}></Slider>
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
            <button onClick={toggleFullscreen}><b>⛶</b></button>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

function Slider({axis, text, default_value=50, snap=true, step=10}) {
  const ctl = useContext(AppContext);
  const [value, set_value] = useState(default_value);
  const [_snap, set_snap] = useState(snap);

  function on_change(ev) {
    let v = ev.target.value/100;
    ctl.on_axis(v, axis);
    set_value(ev.target.value);
  }

  function reset() {
    ctl.on_axis(default_value/100, axis);
    set_value(default_value);
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
    <div className="w-100">
      <input className="w-75" type='range' value={value} max={100} min={0} step={step} 
             onChange={on_change}
             onMouseUp={on_release}
             onTouchEnd={on_release}>
      </input>
      <button className={_snap ? "snapped-slider" : ""} onClick={toggle_snap}>{text}</button>
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
