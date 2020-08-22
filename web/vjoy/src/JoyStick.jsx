import React, { useContext } from 'react';
import ReactNipple from 'react-nipple';
import AppContext from './AppContext';

import 'react-nipple/lib/styles.css';

export function JoyStick({xg, yg, pwidth=150, pheight=150, snap=true}) {
  let ctl = useContext(AppContext);

  function on_move(ev, data) {
    let radian = data.angle.radian;
    let force = data.force;

    let x = Math.cos(radian)*force;
    let y = Math.sin(radian)*force;

    let nx = Math.min(x/3 + 0.5, 1.0);
    let ny = Math.min(-y/3 + 0.5, 1.0);

    ctl.on_axis(nx, xg);
    ctl.on_axis(ny, yg);
  }

  function on_end() {
    if (snap) {
      ctl.on_axis(0.5, xg);
      ctl.on_axis(0.5, yg);
    }
  }

  return (
    <div>
      <ReactNipple
          // supports all nipplejs options
          // see https://github.com/yoannmoinet/nipplejs#options
          options={{ mode: 'static', color: "green", position: { top: '50%', left: '50%' } }}
          // any unknown props will be passed to the container element, e.g. 'title', 'style' etc
          style={{
              outline: `1px dashed green`,
              width: pwidth,
              height: pheight,
              // if you pass position: 'relative', you don't need to import the stylesheet
          }}
          // all events supported by nipplejs are available as callbacks
          // see https://github.com/yoannmoinet/nipplejs#start
          onMove={on_move}
          onEnd={on_end}
      />
    </div>
  )
}