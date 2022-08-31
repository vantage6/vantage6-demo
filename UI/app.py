from flask import Flask, request, render_template
from pathlib import Path

import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("node.html")

@app.route("/researcher")
def researcher():
    return render_template("master.html")


@app.route('/update')
def update():
    age = request.args.get('age', 20)
    weight = request.args.get('weight', 60)

    with open(os.environ["DATABASE_URI"], "w") as f:
        f.write("age;weight\n")
        f.write(""+age+";"+weight)

    return "OK"

if __name__ == "__main__":
    app.run("0.0.0.0", 5000, True)