import numpy as np
import tensorflow as tf
import a3c
import os

os.environ['CUDA_VISIBLE_DEVICES']=''

S_INFO = 6  # bit_rate, buffer_size, rebuffering_time, bandwidth_measurement, chunk_til_video_end
S_LEN = 8  # take how many frames in the past
A_DIM = 6
ACTOR_LR_RATE = 0.0001
CRITIC_LR_RATE = 0.001
VIDEO_BIT_RATE_OPTIONS = [300,750,1200,1850,2850,4300] #kpbs, hardcoded based on possible options for video
RANDOM_SEED = 42
RAND_RANGE = 1000
BUFFER_NORM_FACTOR = 10.0
PRETRAINED = "../rl/test/models/log_reward_equal.ckpt" #pathway to pretrained model file

# Use pensieve RL to compare
def calculate_rl_bitrate(prev_quality, buffer_size, rebuffering_time, video_chunk_size, next_video_chunk_sizes, chunks_remaining):
    """
    prev_quality: kbps
    buffer_size: seconds
    rebuffering_time: seconds
    video_chunk_size: megabytes
    next_video_chunk_sizes: megabytes, list of 6 values
    chunks_remaining: integer
    """

    np.random.seed(RANDOM_SEED)
    with tf.Session() as sess:

        #bring up network architecture
        actor = a3c.ActorNetwork(sess,
                                 state_dim=[S_INFO, S_LEN], action_dim=A_DIM,
                                 learning_rate=ACTOR_LR_RATE)
        critic = a3c.CriticNetwork(sess,
                                   state_dim=[S_INFO, S_LEN],
                                   learning_rate=CRITIC_LR_RATE)

        sess.run(tf.initialize_all_variables())
        saver = tf.train.Saver()

        #bring up pretrained model weights
        nn_model = PRETRAINED
        if nn_model is not None:
            saver.restore(sess, nn_model)
            print("Model restored.")

        #initialize state
        state = np.zeros((S_INFO, S_LEN))
        # state = np.roll(state, -1, axis=1)

        #set state to input values
        # print(float(np.max(VIDEO_BIT_RATE_OPTIONS)))
        state[0, -1] = prev_quality / float(np.max(VIDEO_BIT_RATE_OPTIONS))
        state[1, -1] = buffer_size
        state[2, -1] = rebuffering_time
        state[3, -1] = video_chunk_size
        state[4, :A_DIM] = next_video_chunk_sizes
        state[5, -1] = chunks_remaining

        #make prediction
        action_prob = actor.predict(np.reshape(state, (1, S_INFO, S_LEN)))
        action_cumsum = np.cumsum(action_prob)
        bit_rate = (action_cumsum > np.random.randint(1, RAND_RANGE) / float(RAND_RANGE)).argmax()

        return bit_rate

if __name__ == '__main__':
    a = calculate_rl_bitrate(300,0,0, 5,[1,2,4,5,6,7], 10)
    print(float(a))