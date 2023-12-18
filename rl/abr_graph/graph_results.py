import matplotlib
matplotlib.use('Agg')
from matplotlib.font_manager import FontProperties

import matplotlib.pyplot as plt 
import numpy as np 
import argparse

def isfloat(num):
    try:
        float_equiv = float(num)
        return True
    except:
        return False

def main():
    #parse input arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--log_file', required=True)
    parser.add_argument('--method_name', required=True)

    ARGS = parser.parse_args()

    log_file_name = ARGS.log_file.split("/")[3]

    time = []
    bitrates = []
    buffer_sizes = []
    rebuf_times = []
    delays = []
    rewards = []

    with open(ARGS.log_file, "r") as f:
        data = f.readlines()
        for line in data:
            line = line.strip("\n")
            lines = line.split("\t")

            if isfloat(lines[0]):
                time_stamp = float(lines[0])
                bitrate = float(lines[1])
                buffer_size = float(lines[2])
                rebuf = float(lines[3])
                video_chunk_size = float(lines[4])
                delay = float(lines[5])
                reward = float(lines[6])

                time.append(time_stamp)
                bitrates.append(bitrate)
                buffer_sizes.append(buffer_size)
                rebuf_times.append(rebuf)
                delays.append(delay)
                rewards.append(reward)

    fontP = FontProperties()
    fontP.set_size('xx-small')
 
    start = min(time)
    time = [x - start for x in time]

    fig, axs = plt.subplots(4)
    fig.suptitle(log_file_name + "\n Results Using " + ARGS.method_name)
    axs[0].plot(time, bitrates, "C4")
    axs[0].set_ylabel("Bitrate Selection")
    axs[1].plot(time, buffer_sizes, "C2", label="Buffer Size")
    axs[1].set_ylabel("Buffer AU")
    axs[1].plot(time, rebuf_times, "C3", label="Rebuffering Time")
    legend = axs[1].legend(loc="center right", prop=fontP, bbox_to_anchor=(1.2, 0.5), markerfirst=False, borderaxespad=0.)
    axs[2].plot(time, delays, "C5")
    axs[2].set_ylabel("Network Delay")
    axs[3].plot(time, rewards, "C1")
    axs[3].set_ylabel("Reward")
    axs[3].set_xlabel("Time")
    plt.tight_layout(rect=[0, 0, 1, 0.9])
    plt.savefig("results/" + ARGS.method_name + "_" + log_file_name + ".png", bbox_inches="tight")

if __name__ == '__main__':
    main()
