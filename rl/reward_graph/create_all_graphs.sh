#! /usr/bin/env bash

sudo python graph_reward.py --train_log ../train/results/linear_smooth/log_central --test_log ../train/results/linear_smooth/log_test --output_directory linear_smooth --weighting "Linear Reward with Heavier Smoothness Weighting"
sudo python graph_reward.py --train_log ../train/results/linear_rebuf/log_central --test_log ../train/results/linear_rebuf/log_test --output_directory linear_rebuf --weighting "Linear Reward with Heavier Rebuffering Weighting"
sudo python graph_reward.py --train_log ../train/results/linear_equal/log_central --test_log ../train/results/linear_equal/log_test --output_directory linear_equal --weighting "Linear Reward with Equal Weighting"
sudo python graph_reward.py --train_log ../train/results/log_equal/log_central --test_log ../train/results/log_equal/log_test --output_directory log_equal --weighting "Log Reward with Equal Weighting"
sudo python graph_reward.py --train_log ../train/results/log_rebuf/log_central --test_log ../train/results/log_rebuf/log_test --output_directory log_rebuf --weighting "Log Reward with Heavier Rebuffering Weighting"
sudo python graph_reward.py --train_log ../train/results/log_smooth/log_central --test_log ../train/results/log_smooth/log_test --output_directory log_smooth --weighting "Log Reward with Heavier Smoothness Weighting"






