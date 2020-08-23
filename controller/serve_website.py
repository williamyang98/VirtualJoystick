from flask import Flask, render_template, send_file

app = Flask(__name__, static_folder="./website/static", template_folder="./website/")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/favicon.ico")
def favicon():
    return send_file("./website/favicon.ico")

if __name__ == '__main__':
    app.run(host="192.168.2.10", port=3000, debug=False)