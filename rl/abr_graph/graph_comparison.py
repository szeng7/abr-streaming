import matplotlib
matplotlib.use('Agg')
from matplotlib.font_manager import FontProperties

import matplotlib.pyplot as plt 
import numpy as np 
import argparse

import os

def isfloat(num):
    try:
        float_equiv = float(num)
        return True
    except:
        return False

def main():
    #parse input arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--log_file_directory', required=True)

    ARGS = parser.parse_args()
    reward_values = {
        "bb" : [],
        "mpc": [],
        "rl": []
    }

    #open every log file in directory
    for file in os.listdir(ARGS.log_file_directory):
        if file.startswith("log_"):
            with open(ARGS.log_file_directory + "/" + file, "r") as f:
                technique = file.split("_")[2]

                data = f.readlines()
                for line in data:
                    line = line.strip("\n")
                    lines = line.split("\t")
                    if isfloat(lines[0]):
                        reward = float(lines[6])
                        reward_values[technique].append(reward)

    #get median, 5th and 95th percentile values of all the reward values of
    #each algorithm
    bb_values_sorted = np.sort(np.asarray(reward_values["bb"]))
    bb_median = np.median(bb_values_sorted)
    bb_5per = np.percentile(bb_values_sorted, 5)
    bb_95per = np.percentile(bb_values_sorted, 95)

    mpc_values_sorted = np.sort(np.asarray(reward_values["mpc"]))
    mpc_median = np.median(mpc_values_sorted)
    mpc_5per = np.percentile(mpc_values_sorted, 2)
    mpc_95per = np.percentile(mpc_values_sorted, 95)

    rl_values_sorted = np.sort(np.asarray(reward_values["rl"]))
    rl_median = np.median(rl_values_sorted)
    rl_5per = np.percentile(rl_values_sorted, 5)
    rl_95per = np.percentile(rl_values_sorted, 95)

    #graph as a scatterplot with "error bars"
    x = ["BB", "MPC", "RL"]
    xn = range(3)
    medians = [bb_median, mpc_median, rl_median]
    bottom_bar = [bb_median - bb_5per, mpc_median - mpc_5per, rl_median - rl_5per]
    top_bar = [bb_95per - bb_median, mpc_95per - mpc_median, rl_95per - rl_median]
    plt.errorbar(xn, medians, yerr=[bottom_bar, top_bar], fmt='o')
    plt.xticks(xn, x)
    plt.title("Reward Values Comparison of Different ABR Algorithms")
    plt.xlabel("ABR Algorithm")
    plt.ylabel("Reward Value")
    plt.savefig("results/aggregate_comparison.png")

if __name__ == '__main__':
    main()
