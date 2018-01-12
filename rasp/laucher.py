#!/usr/bin/python2

import nfc
import os
import csv
import requests
import datetime
import threading
import requests
import time

deviceid = ""

def request_url(uri, tag):
        r = requests.get('http://localhost:8888' + uri + '?uid={}'.format(tag))


def main_looper(usb_id):
        global deviceid
        clf = nfc.ContactlessFrontend()
        clf.open(usb_id)
        clf.device.turn_off_led_and_buzzer()
        while True:
                tag = clf.connect(rdwr={'on-connect': lambda tag: False})
                if (deviceid == ""):
                        deviceid = usb_id
                elif (deviceid == usb_id):
                        time.sleep(1)
                        request_url("/gauche", tag)
                        print("gauche")
                else:
                        time.sleep(1)
                        request_url("/droite", tag)
                        print("droite")
                print(tag)
                print(usb_id)
                print(deviceid)
arg1 = ""
arg2 = ""

os.system("lsusb > usb")
fd = open("usb", "r")
result = fd.read()
fd.close()
tab = result.decode().split('\n')
for i in range(0, len(tab)) :
        if tab[i].find("Advanced Card Systems") >= 0 :
                bus = tab[i].split()[1]
                dev = tab[i].split()[3]
                if arg1 == "" :
                        arg1 = "usb:" + bus + ":" + dev.split(":")[0]
                elif arg2 == "" :
                        arg2 = "usb:" + bus + ":" + dev.split(":")[0]

thread1 = threading.Thread(target=main_looper, args=(str(arg1), ))
thread2 = threading.Thread(target=main_looper, args=(str(arg2), ))
thread1.start()
thread2.start()

thread1.join()      #Wait until thread1 has finished execution
thread2.join()      #Wait until thread2 has finished execution
print ("I am the main thread, the two threads are done")
