from flask import Flask, render_template ,jsonify ,request
from datetime import datetime
import sqlite3
import time
import json
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/get_all', methods=['POST'])
def getAllElements():

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    list = []
    for row in corsor.execute("select * from data"):
        list.append(row)
    
    print(list)
    connection.close()
    return jsonify(list)

@app.route('/get', methods=['POST'])
def getElement():

    data = request.json
    text = data['param']['text']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    corsor.execute("select * from data where value=:v", {"v": text})
    search = corsor.fetchall()
    connection.close()
    return jsonify(search)

@app.route('/add', methods=['POST'])
def add_element():

    data = request.json
    text = data['param']['text']

    new_data = {
        "text": str(text),
    }

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    corsor.executemany("insert into data values (?,?)", [(str(datetime.now()),text)])
    connection.commit() 
    connection.close()

    return "200"

@app.route('/remove', methods=['POST'])

def removeElement():

    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    corsor.execute("delete from data where id=:i", {"i": id})
    connection.commit() 
    connection.close()

    return "200"

@app.route('/update', methods=['POST'])

def updateElement():

    data = request.json
    id = data['param']['id']
    value = data['param']['text']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    corsor.execute("update data set value=:v where id=:i", {"i": id, "v": value})
    connection.commit() 
    connection.close()

    return "200"
 
if __name__ == '__main__':

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()
    corsor.execute("create table if not exists data (id text, value text)")
    connection.close()

    app.run(debug=True)

 