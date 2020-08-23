export class Controller {
  constructor() {
    this.ws = null;
  }

  connect(url) {
    if (!url) {
      url = `ws://${document.location.hostname}:8765`;
    }
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = () => {
      this.send(new Uint8Array([0xFF]));
    }
  }

  send(p) {
    if (!this.ws) {
      return;
    }
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