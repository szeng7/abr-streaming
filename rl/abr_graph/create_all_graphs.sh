#! /usr/bin/env bash

python graph_results.py --log_file ../test/results/log_sim_bb_ferry.nesoddtangen-oslo-report.2010-09-22_0702CEST.log --method_name buffer-based
python graph_results.py --log_file ../test/results/log_sim_mpc_ferry.nesoddtangen-oslo-report.2010-09-22_0702CEST.log --method_name mpc
python graph_results.py --log_file ../test/results/log_sim_rl_ferry.nesoddtangen-oslo-report.2010-09-22_0702CEST.log --method_name rl

python graph_comparison.py --log_file_directory ../test/results
