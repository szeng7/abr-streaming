#! /usr/bin/env bash

sudo ./rename_ownership.sh
python get_video_sizes.py
python rl_no_training.py
python plot_results.py
