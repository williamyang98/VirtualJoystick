from Controller import Controller

import time
from threading import Thread
import numpy as np

import asyncio
import websockets
import struct

ctl = Controller(1)

axis_ids = {
    'x': 0x83,
    'y': 0x84,
    'z': 0x85,
    'rx': 0x86,
    'ry': 0x87,
    'rz': 0x88,
};

axis_lookup = {
    0x83: lambda v: ctl.set_x(v),
    0x84: lambda v: ctl.set_y(v),
    0x85: lambda v: ctl.set_z(v),
    0x86: lambda v: ctl.set_rx(v),
    0x87: lambda v: ctl.set_ry(v),
    0x88: lambda v: ctl.set_rz(v),
    0x89: lambda v: ctl.set_slider_0(v),
    0x90: lambda v: ctl.set_slider_1(v),
}

async def socket_listen(websocket, path):
    async for packet in websocket:
        if not isinstance(packet, bytes):
            continue

        # print(packet)

        m = list(packet)
        h = m[0]

        if h == 0xff:
            print('Connected (reset)')
            ctl.reset()
            continue

        if h == 0x81:
            b = m[1]
            ctl.on_button_press(b)
            continue

        if h == 0x82:
            b = m[1]
            ctl.on_button_release(b)
            continue
        
        axis_cb = axis_lookup.get(h, None)
        if axis_cb is not None:
            if len(m) != 5:
                print(f'Invalid byte count ({len(m)}) for axis {h}') 
            val = struct.unpack('f', bytes(m[1:5]))
            axis_cb(val)
            continue

        if h == 0xAF:
            x, y = struct.unpack('ff', bytes(m[1:9]))
            print(x, y)

if __name__ == '__main__':
    server = websockets.serve(socket_listen, "192.168.2.10", 8765)
    asyncio.get_event_loop().run_until_complete(server)

    try:
        print("Running client")
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("Stopping")