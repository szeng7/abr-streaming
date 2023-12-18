import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import numpy as np

import argparse

def main():
	#parse input arguments
	parser = argparse.ArgumentParser()
	parser.add_argument('--train_log', required=True)
	parser.add_argument('--test_log',required=True)
	parser.add_argument('--output_directory',required=True)
	parser.add_argument('--weighting', required=False)

	ARGS = parser.parse_args()
	
	train_epochs = []
	train_loss = []
	train_reward = []

	#open train log file and parse contents
	with open(ARGS.train_log, "r") as f:
		data = f.readlines()
		for line in data:
			if "Epoch" in line:
				lines = line.split(" ")
				epoch_num = float(lines[1])
				loss = float(lines[3])
				reward = float(lines[5])
				entropy = float(lines[7])

				train_epochs.append(epoch_num)
				train_loss.append(loss)
				train_reward.append(reward)
	
	#determine maxes and mins for axes limits
	xlim_max = max(train_epochs)
	ylim_min = min(train_loss)
	ylim_max = max(train_loss)

	#plot and save loss graph
	fig, ax = plt.subplots()
	plt.title("Train Loss vs Epoch Number for \n" + ARGS.weighting)	
	plt.xlabel("Epoch Number")
	plt.ylabel("Loss Value")
	plt.plot(train_epochs, train_loss, label="Loss")
	plt.xlim(0, xlim_max)
	plt.ylim(ylim_min, ylim_max)
	plt.tight_layout()
	plt.savefig(ARGS.output_directory + "/train_loss.png")
	plt.clf()
	plt.cla()

	#determine new maxes and mins for axes limits
	xlim_max = max(train_epochs)
	ylim_min = min(train_reward)
	ylim_max = max(train_reward)

	#plot and save reward graph
	fig, ax = plt.subplots()
	plt.title("Train Reward vs Epoch Number for \n" + ARGS.weighting)	
	plt.xlabel("Epoch Number")
	plt.ylabel("Reward Value")
	plt.plot(train_epochs, train_reward, "C1", label="Reward Value")
	plt.xlim(0, xlim_max)
	plt.ylim(ylim_min, ylim_max)
	plt.tight_layout()
	plt.savefig(ARGS.output_directory + "/train_reward.png")
	plt.clf()
	plt.cla()

	test_epochs = []
	test_median_rewards = []
	test_95per_rewards = []
	test_5per_rewards = []

	#open test log file and parse through contents
	with open(ARGS.test_log, "r") as f:
		data = f.readlines()
		for line in data:
			line = line.strip("\n")
			lines = line.split("\t")
			epoch = float(lines[0])
			rew_min = float(lines[1])
			rew_5per = float(lines[2])
			rew_mean = float(lines[3])
			rew_median = float(lines[4])
			rew_95per = float(lines[5])
			rew_max = float(lines[6])

			test_epochs.append(epoch)
			test_median_rewards.append(rew_median)
			test_5per_rewards.append(rew_5per)
			test_95per_rewards.append(rew_95per)

	#determine maxes and mins for axes limits
	xlim_max = max(test_epochs)
	ylim_max = max(test_95per_rewards) + 10
	ylim_min = min(test_5per_rewards) + 10

	plt.xlabel("Epoch")
	plt.ylabel("Reward Value")
	plt.title("Validation Reward Value vs Epoch Number for \n" + ARGS.weighting)
	
	#plot 5th and 95th percentile values and fill in the y-space in between to
	#give us idea of reward value variance at each epoch value
	plt.fill_between(test_epochs, test_5per_rewards, test_95per_rewards, alpha=0.2)  
	
	plt.plot(test_epochs, test_median_rewards)
	plt.xlim(0, xlim_max)
	plt.ylim(ylim_min, ylim_max)
	plt.tight_layout()
	plt.savefig(ARGS.output_directory + "/test_reward.png")
	plt.clf()
	plt.cla()

if __name__ == '__main__':
	main()
