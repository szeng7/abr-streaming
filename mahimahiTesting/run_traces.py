# adapted from https://github.com/hongzimao/pensieve/blob/master/run_exp/run_traces.py
# this is a script to run mahimahi

import sys
import os
import subprocess
import numpy as np

RUN_SCRIPT = 'run_video.py'
RANDOM_SEED = 42
RUN_TIME = 320  # sec
MM_DELAY = 40   # millisec

def main():
    print "run_traces started"

    trace_path = sys.argv[1]
    abr_algo = sys.argv[2]
    process_id = sys.argv[3]
    ip = sys.argv[4]

    # print trace_path
    # print abr_algo
    # print process_id
    # print ip


    sleep_vec = range(1, 10)  # random sleep second

    files = os.listdir(trace_path)
    for f in files:

        while True:

            np.random.shuffle(sleep_vec)
            sleep_time = sleep_vec[int(process_id)]

            command = 'mm-delay ' + str(MM_DELAY) + ' mm-link 12mbps ' + trace_path + f + ' ' + '/usr/bin/python ' + RUN_SCRIPT + ' ' + ip + ' ' + abr_algo + ' ' + str(RUN_TIME) + ' ' + process_id + ' ' + f + ' ' + str(sleep_time)
            print command

            proc = subprocess.Popen('mm-delay ' + str(MM_DELAY) + 
                      ' mm-link 12mbps ' + trace_path + f + ' ' +
                      '/usr/bin/python ' + RUN_SCRIPT + ' ' + ip + ' ' +
                      abr_algo + ' ' + str(RUN_TIME) + ' ' +
                      process_id + ' ' + f + ' ' + str(sleep_time),
                      stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            print "out of subprocess"
            (out, err) = proc.communicate()
            print "escape proc.communicate call"
            if out == 'done\n':
                break
            else:
                print "retry log posted"
                with open('./chrome_retry_log', 'ab') as log:
                    log.write(abr_algo + '_' + f + '\n')
                    log.write(out + '\n')
                    log.flush()
            print "out of done/retry log check"

if __name__ == '__main__':
    main()