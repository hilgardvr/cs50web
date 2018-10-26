import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}

class Message:
    def __init__(self, user, msg, time):
        self.user = user
        self.msg = msg
        self.time = time

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/get-list", methods=["GET"])
def apiGetList():
    return jsonify({"existing_channels": channels})

@socketio.on("add channel")
def addChannel(data):
    channel = data["channel"]
    if channel in channels:
        emit("announce channels", {"success": False, "channels": channels});
    else:
        #print("user: " + data['user'] + "date: " + data['date'])
        channels[channel] = []
        #{"the_user": "the_message"}
        chans = {"success":True, "channels": channels}
        emit("announce channels", chans, broadcast=True)

@socketio.on("add message")
def addMessage(data):
    channelToAddTo = data["channel"]
    channels[channelToAddTo].append({"user": data['user'], "message": data['message'], "date": data['date']})
    print(channels)
    chans = {"success":True, "channels": channels}
    emit("announce channels", chans, broadcast=True)
