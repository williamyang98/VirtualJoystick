from vjoy import *
import numpy as np
import math

def norm_clip( func):
    def wrapped(self, x):
        return func(self, np.clip(x, 0, 1))
    return wrapped

class Controller:
    def __init__(self, rid):
        self.rid = rid
        if not VJoy.AcquireVJD(self.rid):
            pid = VJoy.GetOwnerPid(self.rid)
            raise IOError(f"vjoy {rid} in use by pid {pid}")

        self.max_x = VJoy.GetVJDAxisMax(rid, HID_USAGE_X)
        self.max_y = VJoy.GetVJDAxisMax(rid, HID_USAGE_Y)
        self.max_z = VJoy.GetVJDAxisMax(rid, HID_USAGE_Z)
        self.max_rx = VJoy.GetVJDAxisMax(rid, HID_USAGE_RX)
        self.max_ry = VJoy.GetVJDAxisMax(rid, HID_USAGE_RY)
        self.max_rz = VJoy.GetVJDAxisMax(rid, HID_USAGE_RZ)
        self.max_btns = VJoy.GetVJDButtonNumber(rid)
        self.max_sl0 = VJoy.GetVJDAxisMax(rid, HID_USAGE_SL0)
        self.max_sl1 = VJoy.GetVJDAxisMax(rid, HID_USAGE_SL1)
        self.max_pov = 0x8C40

        self.reset()
    
    def reset(self):
        pdata = JOYSTICK_POSITION()
        pdata.wAxisX = self.max_x >> 1
        pdata.wAxisY = self.max_y >> 1
        pdata.wAxisZ = self.max_z >> 1
        pdata.wAxisXRot = self.max_rx >> 1
        pdata.wAxisYRot = self.max_ry >> 1
        pdata.wAxisZRot = self.max_rz >> 1

        pdata.wSL0 = self.max_sl0 >> 1
        pdata.wSL1 = self.max_sl1 >> 1
        pdata.lButtons = 0x00000000
        pdata.bHats = self.max_pov 
        self.pdata = pdata
        self.update()
    
    def update(self):
        return VJoy.UpdateVJD(self.rid, self.pdata)

    @norm_clip
    def set_x(self, x):
        self.pdata.wAxisX = math.floor(self.max_x*x)
        self.update()

    @norm_clip
    def set_y(self, y):
        self.pdata.wAxisY = math.floor(self.max_y*y)
        self.update()

    @norm_clip
    def set_z(self, z):
        self.pdata.wAxisZ = math.floor(self.max_z*z)
        self.update()

    @norm_clip
    def set_rx(self, rx):
        self.pdata.wAxisXRot = math.floor(self.max_rx*rx)
        self.update()

    @norm_clip
    def set_ry(self, ry):
        self.pdata.wAxisYRot = math.floor(self.max_ry*ry)
        self.update()

    @norm_clip
    def set_rz(self, rz):
        self.pdata.wAxisZRot = math.floor(self.max_rz*rz)
        self.update()
    
    @norm_clip
    def set_slider_0(self, v):
        self.pdata.wSL0 = math.floor(self.max_sl0*v)
        self.update()

    @norm_clip
    def set_slider_1(self, v):
        self.pdata.wSL1 = math.floor(self.max_sl1*v)
        self.update()

    def set_button(self, btn, state):
        if btn <= 0 or btn > self.max_btns:
            raise ValueError(f"Invalid button {btn}")

        if state:
            self.pdata.lButtons |= 1 << (btn-1)
        else:
            self.pdata.lButtons &= ~(1 << (btn-1))
        self.update()
    
    def on_button_press(self, btn):
        self.set_button(btn, True)
    
    def on_button_release(self, btn):
        self.set_button(btn, False)





    

    

    
