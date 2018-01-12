#!/bin/bash

cd ~/hub-poll/
pm2 start server.js

chromium-browser --noerrdialogs --kiosk --incognito http://localhost:8888 &

cd rasp

./laucher.py
