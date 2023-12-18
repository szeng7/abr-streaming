# Adaptive Bitrate Algorithms Cloud Final Project 2020
## Will Ye, Simon Zeng, Jason Zhang

- We aim to investigate how adaptive bitrate algorithms work in video streaming systems.
- Based on Pensieve https://github.com/hongzimao/pensieve
- Look under `/rl` for the reinforcement learning component
- Look under `/videoPlayer` for our custom video player system

## Remote Desktop Setup
- because of instance limitations for multiple validators, we decided to have a dedicated GCP instance for each validator. Because there is a video component to it, we also want the validators to be able to watch the video player. So we decided to go with NoMachine.
- NoMachine setup followed this [set up video](https://www.youtube.com/watch?v=eolNziYLe9Y)
- only extra configuration was with which default desktop command is run by nomachine. To set it, edit ```/usr/NX/etc/node.cfg``` on the GCP instance with an editor and change the ```DefaultDesktopCommand``` line to be ```DefaultDesktopCommand "gnome-session"```, or an equivalent command to run a desktop environment.
- refer to our VM instructions on how to download the NoMachine client and access the GCP via local machine