#!/usr/bin/python3

import subprocess

result = subprocess.run(['lsusb'], stdout=subprocess.PIPE)
tab = result.stdout.decode().split('\n')
for i in range(0, len(tab)) :
        if tab[i].find("Advanced Card Systems") >= 0 :
                bus = tab[i].split()[1]
                dev = tab[i].split()[3]
                print(bus)
                print(dev.split(":")[0])