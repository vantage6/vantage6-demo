from flask import Flask, request, render_template
from pathlib import Path

import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("node.html")

@app.route("/demoA")
def index():
    return render_template("nodeA.html")

@app.route("/demoB")
def index():
    return render_template("nodeB.html")

@app.route("/demoC")
def index():
    return render_template("nodeC.html")

@app.route("/researcher")
def researcher():
    return render_template("master.html")


@app.route('/update')
def update():
    data1 = request.args.get('data1', 20)
    data2 = request.args.get('data2', 20)
    data3 = request.args.get('data3', 20)
    label = request.args['label']

    with open(os.environ["DATABASE_URI"], "w") as f:
        f.write("numeric,numeric\n")
        f.write(f"ID,{label}\n")
        f.write(f"1,{data1}")
        f.write(f"2,{data2}")
        f.write(f"3,{data3}")

    return "OK"

if __name__ == "__main__":
    app.run("0.0.0.0", 5000, True)