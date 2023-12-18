#! /usr/bin/env bash

sudo ./rename_ownership.sh
sudo python get_video_sizes.py
python multi_agent.py
