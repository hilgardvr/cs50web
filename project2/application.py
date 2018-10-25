import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template('index.html')


@socketio.on("add channel")
def addChannel(data):
    channel = data["channel"]
    if channel in channels:
        emit("announce channels", {"success": False, "channels": channels});
    else:
        channels.append(channel)
        chans = {"success":True, "channels": channels}
        emit("announce channels", chans, broadcast=True)

@app.route("/api/get-list", methods=["GET"])
def apiGetList():
    print("inside api")
    return jsonify({"existing_channels": channels})
