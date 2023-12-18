from flask import Flask, render_template, redirect, url_for, request, jsonify, json
from flask import make_response
from rules.rl import calculate_rl_bitrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def home():
    return "Hello World"

@app.route('/testABR', methods=['POST'])
def testABR():

    data = json.loads(request.form.get('mydata'))

    currQuality = data['currQuality']
    buffer = data['buffer']
    rebufferTime = data['rebufferTime']
    chunkSize = data['chunkSize']
    chunksRemaining = data['chunksRemaining']
    nextChunks = data['nextChunks']

    val = calculate_rl_bitrate(currQuality, buffer, rebufferTime, chunkSize, nextChunks, chunksRemaining)
    print(val)
    return str(val)

if __name__ == "__main__":
    app.run(debug = True)