from flask import Flask, render_template, send_file
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_folder="./website/static", template_folder="./website/")
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/favicon.ico")
def favicon():
    return send_file("./website/favicon.ico")

@socketio.on("data")
def on_data(data):
    from on_packet import on_packet
    on_packet(bytes(data))

@socketio.on("connect")
def on_connect():
    print("Connection")

if __name__ == '__main__':
    socketio.run(app, host="192.168.2.10", port=3000, log_output=True)