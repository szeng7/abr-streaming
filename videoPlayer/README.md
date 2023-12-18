# Video Streaming ABR Testbed

# Instructions for validation
- For validation we aim to show our created video player can play video using different ABR algorithms
- What you want to validate is that our can playback video and change ABR algorithms
- To get connected to the GCP GUI follow [https://docs.google.com/document/d/1rnqRc_KpFMQkcl3EpjDw-fyKJKmMCyTpXr2QE1lmQek/edit?usp=sharing](https://docs.google.com/document/d/1rnqRc_KpFMQkcl3EpjDw-fyKJKmMCyTpXr2QE1lmQek/edit?usp=sharing) (Can just follow this google doc instructions, below instructions will be included there too)
- go into `/home/demo/CloudFinalProject/videoPlayer/` to get to the video player (In the GCP Gui)
- run `./runValidation`
- Go to `http://localhost:8000` and play the video, you should see a graph of the bitrate/buffer underneath the video

# General notes about running the system (Ignore these if you are running on GCP, that environment is already set up)

# Dependencies
- Requires Mininet (`sudo apt-get install mininet`) (Only if you want to run with Mininet as well)
- Install controller as well (`sudo apt-get install openvswitch-testcontroller`) (Only if you want to run with Mininet as well)
- Create a python2.7 virtualenv and run `pip install -r requirements.txt` and use the environment to run code
- Google Chrome and Python
- Requires Flask
- Linux based OS

# Running with Mininet
- run `python topology.py` (may need to run as sudo if prompted), currently the topology is a simple Star topology with 3 hosts, host 2 is default server
- Inside `main.js` change the restAPI ip to the one that is commented with `mininet`
- in Mininet console run `xterm h1 h2 h3` to get terminal emulators for the hosts
- in terminal for h2 run `./start_server.sh`
- in terminal for h1 and h3 run `./start_browser.sh`
- You should see Chrome open with video players for each of the hosts.

# Notes
- There is a python flask server started locally on port 5000, this is to interface with future python scripts
- The server running on h2 is a simple server with CORS access appended to headers
