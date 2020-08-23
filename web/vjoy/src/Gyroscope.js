import React, { Component } from 'react';
import AppContext from './AppContext'
import "./Gyroscope.css";

export class Gyroscope extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {enabled: true, x: null, y: null};
    }

    componentDidMount() {
        window.addEventListener(
           "deviceorientation", 
           ev => this.handle_orientation(ev));
    }

    handle_orientation(ev) {
        this.setState({...this.state, x: 0, y: 0});

        if (!this.state.enabled) {
            return;
        }

        let x = ev.beta;  // [-180, 180]
        let y = ev.gamma; // [-90, 90]

        if (x == null || y == null) {
            this.setState({...this.state, x, y});
            return;
        }

        x = this.clip(x, -90, 90);
        y = this.clip(y, -90, 90);

        x = (x + 90) / 180;
        y = (y + 90) / 180;

        let ctl = this.context;
        let p = new Uint8Array(new Float32Array([x, y]).buffer);
        ctl.send(new Uint8Array([0xaf, ...p]));
        // ctl.on_axis(x, 'x');
        // ctl.on_axis(y, 'y');

        this.setState({...this.state, x, y});
    }

    clip(v, min, max) {
        return Math.min(Math.max(v, min), max);
    }

    toggle() {
        this.setState({enabled: !this.state.enabled});
    }

    render() {
        return <div>
            <button 
            className={this.state.enabled ? "gyro-enabled" : ""} 
            onClick={() => this.toggle()}>Gyro</button>

            <label style={{marginLeft: '2px'}}>x: {this.state.x || '?'}, y: {this.state.y || '?'}</label>

            </div>;
    }
}