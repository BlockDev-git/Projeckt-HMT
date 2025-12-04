from flask import Flask, render_template ,jsonify ,request
from flask_apscheduler import APScheduler
from datetime import datetime, timedelta
import sqlite3
import time
import json
import os
import uuid

app = Flask(__name__)
scheduler = APScheduler()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    return render_template("search.html")

@app.route("/device")
def device():
    return render_template("device.html")

@app.route('/device/<deviceID>')
def spesifcID(deviceID):
    print(deviceID)
    return render_template("device.html")

@app.route("/type")
def type():
    return render_template("type.html")

# ---------------- USER LOGIN ----------------

@app.route('/check_password', methods=['POST'])
def check_password():
    data = request.json
    input_password = data['param']['password']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("SELECT password FROM users WHERE username=?", ("admin",))
    search = corsor.fetchall()
    connection.close()

    if search[0][0] == input_password:

        connection = sqlite3.connect("Database.db")
        corsor = connection.cursor()

        expiration = datetime.now()
        expiration = expiration + timedelta(minutes=10)

        key = str(uuid.uuid4())

        corsor.execute("INSERT INTO connections (key, expiration) VALUES (?, ?)", [key, expiration])
        connection.commit() 
        connection.close()

        return jsonify([True, key])
    else:
        return jsonify([False, None])
    
@app.route('/check_key', methods=['POST'])
def check_key():
    data = request.json
    key = data['param']['key']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("select * from connections where key=:k", {"k": key})
    search = corsor.fetchall()
    connection.close()

    print(search)

    if search != []:
        return jsonify(True)
    else:
        return jsonify(False)
    
@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    key = data['param']['key']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("delete from connections where key=:k", {"k": str(key)})
    connection.commit()
    connection.close()

    return "200"

@scheduler.task('interval', id='task', seconds=10)
def task():
    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    for row in corsor.execute("select * from connections"):

        expirationDate = datetime.strptime(row[2], "%Y-%m-%d %H:%M:%S.%f")

        if expirationDate < datetime.now():
            corsor.execute("delete from connections where id=:i", {"i": row[0]})
            connection.commit() 
    
    connection.close()

# ---------------- DB Template ----------------

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

    # DB Connection
    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    # User-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)")
    corsor.execute("SELECT * FROM users WHERE username=?", ("admin",))
    if corsor.fetchone() is None:
        corsor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", "4admin"])
    
    connection.commit()

    # Connections-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS connections (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, expiration DATETIME)")

    # Data-Tabel
    corsor.execute("create table if not exists data (id text, value text)")
    connection.close()

    scheduler.init_app(app)
    scheduler.start()
    
    app.run(debug=True)