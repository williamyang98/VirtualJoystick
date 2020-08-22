from vjoy import *

import time
from threading import Thread
import numpy as np

RID = 1

def main():
    if not VJoy.AcquireVJD(RID):
        pid = VJoy.GetOwnerPid(RID)
        print(f"VJoy already used by {pid}")
        return

    min_x, max_x = VJoy.GetVJDAxisMin(RID, HID_USAGE_X), VJoy.GetVJDAxisMax(RID, HID_USAGE_Y)

    dt = 0.01
    speed = int((max_x-min_x) * dt)

    scale = 5
    sspeed = scale * speed

    running = True

    VJoy.ResetVJD(RID)
    print(VJoy.GetVJDStatus(RID))

    max_axis = HID_USAGE_X
    for axis in range(HID_USAGE_X, HID_USAGE_POV+1):
        if VJoy.GetVJDAxisExist(RID, axis):
            max_axis = axis
        else:
            break
    
    def axis_test():
        axis_range = list(range(min_x, max_x, sspeed))
        axis_spread = axis_range + axis_range[::-1]
        while running:
            for val in axis_spread:
                for axis in range(HID_USAGE_X, max_axis+1):
                    VJoy.SetAxis(val, RID, axis)
                time.sleep(0.01)

    def pov_test():
        while running:
            #VJoy.SetContPov()
            break


    def button_test():
        while running:
            n = VJoy.GetVJDButtonNumber(1)
            states = np.random.rand(n) > 0.5

            for i, state in enumerate(states):
                bid = i+1
                VJoy.SetBtn(state, RID, bid)

            time.sleep(0.2)
            

    t1 = Thread(target=axis_test)
    t2 = Thread(target=button_test)
    t1.start()
    t2.start()

    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        pass
    finally:
        running = False
        t1.join()
        t2.join()


if __name__ == '__main__':
    main()