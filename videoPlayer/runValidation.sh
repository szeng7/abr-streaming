#! /bin/bash

# This script starts an http enabled cors server and a regular flask api
# Access the website at http://localhost:8000
# Flask restapi is at http://localhost:5000
# What you should expect: you should see the video playing and the corresponding graph underneath

python http_cors_enabled.py &
python restAPI.py &
google-chrome --no-sandbox index.html