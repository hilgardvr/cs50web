import os

from flask import Flask, render_template, request
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
    #print("a user tried to add: ")
    #print(data)
    channels.append(channel)
    emit("announce channels", channels, broadcast=True)
