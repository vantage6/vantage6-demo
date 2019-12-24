from flask import Flask, render_template

app = Flask("demo-ui")

@app.route("/")
def index():
    return "index"

@app.route("/input")
def input_():
    return "input"

@app.route("/waiting")
def waiting():
    return "waiting"

@app.route("/report")
def report():
    return "reporting"
