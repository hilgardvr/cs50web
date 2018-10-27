import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


class Channel:
    def __init__(self, name):
        self.name = name
        self.messages = {}
        self.status = "Not Set"
        self.user = "Not Updated"

    def __eq__(self, other):
        return self.name == other.name

channels = {}
#channels = []

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
        emit("announce channel", {"success": False, "channel": channel});
    else:
        channels[channel] = []
        chans = {"success":True, "channel": channel}
        emit("announce channel", chans, broadcast=True)

#@socketio.on("add channel")
#def addChannel(data):
#    channel = Channel(data["channel"])
#    if channel in channels:
#        emit("announce channel", {"success": False, "channel": channel});
#    else:
#        channels.append(channel)
#        chans = {"success":True, "channel": channel}
#        emit("announce channel", chans, broadcast=True)

@socketio.on("add message")
def addMessage(data):
    if data['message'] == "":
        emit("announce message", {"success":False});
    else:
        channelToAddTo = data["channel"]
        message = {"user": data['user'], "message": data['message'], "date": data['date']}
        maxMsgs = 100
        if len(channels[channelToAddTo]) >= maxMsgs:
            channels[channelToAddTo].pop(0)
        channels[channelToAddTo].append(message)
        chans = {"success":True, "channel": channelToAddTo, "message": message}
        emit("announce message", chans, broadcast=True)

@socketio.on("set channel status")
def setChannelStatus(data):
    channel = data["channel"]
