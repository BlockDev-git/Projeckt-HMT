from flask import Flask, render_template ,jsonify ,request
from flask_apscheduler import APScheduler
from datetime import datetime, timedelta
import sqlite3
import time
import json
import os
import uuid
import bcrypt

app = Flask(__name__)
scheduler = APScheduler()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/denied")
def denied():
    return render_template("denied.html")

@app.route("/not_found")
def not_found():
    return render_template("not_found.html")

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

@app.route("/creat_type")
def creatType():
    return render_template("type.html")

@app.route("/type/<typeID>")
def type(typeID):
    return render_template("type.html")

# ---------------- USER LOGIN ----------------

@app.route('/check_password', methods=['POST'])
def check_password():
    data = request.json
    input_password = data['param']['password']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("SELECT password FROM users WHERE username=?", ("admin",))
    currentPassword = corsor.fetchall()

    corsor.execute("SELECT salt FROM users WHERE username=?", ("admin",))
    salt = corsor.fetchall()
    connection.close()

    input_password = bytes([ord(char) for char in input_password])
    input_password = bcrypt.hashpw(input_password, salt[0][0])

    if currentPassword[0][0] == input_password:

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
    
@app.route('/update_password', methods=['POST'])
def update_password():
    data = request.json
    new_password = data['newParam']['password']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT salt FROM users WHERE username=?", ("admin",))
    salt = cursor.fetchall()

    new_password = bytes([ord(char) for char in new_password])
    new_password = bcrypt.hashpw(new_password, salt[0][0])

    cursor.execute("UPDATE users SET password=? WHERE username=?", (new_password, "admin"))
    connection.commit()
    connection.close()

    return jsonify(True)
    
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

@app.route('/add_type', methods=['POST'])
def add_type():

    data = request.json
    name = data['param']['name']
    device_type = data['param']['device_type']
    warranty = data['param']['warranty']
    manufacturer = data['param']['manufacturer']
    product_url = data['param']['product_url']
    image_url = data['param']['image_url']
    comment = data['param']['comment']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("INSERT INTO device_typ (name, device_type, warranty, manufacturer, product_url, image_url, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (name, device_type, warranty, manufacturer, product_url, image_url, comment, datetime.now()))
    connection.commit()
    connection.close()

    return jsonify(True)

@app.route('/get_type', methods=['POST'])
def get_type():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device_typ WHERE id=:i",{"i": str(id)})
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

@app.route('/delete_type', methods=['POST'])
def delete_type():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM device_typ WHERE id=:i",{"i": str(id)})

    connection.commit()
    connection.close()

    return jsonify(True)

@app.route('/update_type', methods=['POST'])
def update_type():
    data = request.json
    id = data['param']['id']

    data = request.json
    name = data['param']['name']
    device_type = data['param']['device_type']
    warranty = data['param']['warranty']
    manufacturer = data['param']['manufacturer']
    product_url = data['param']['product_url']
    image_url = data['param']['image_url']
    comment = data['param']['comment']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("UPDATE device_typ SET name=:n, device_type=:d, warranty=:w, manufacturer=:m, product_url=:p, image_url=:i, comment=:c WHERE id=:id", {"id": id, "n": name, "d": device_type, "w": warranty, "m": manufacturer, "p": product_url, "i": image_url, "c": comment})
    connection.commit()
    connection.close()

    return jsonify(True)
 
if __name__ == '__main__':

    # DB Connection
    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    # User-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, salt TEXT)")
    corsor.execute("SELECT * FROM users WHERE username=?", ("admin",))
    if corsor.fetchone() is None:

        password = b'4admin' # Default Passwort soll bei benutzung geändertwerden
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt)

        corsor.execute("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)", ["admin", hashed, salt])
    
    connection.commit()

    # Connections-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS connections (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, expiration DATETIME)")

    # Type-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS device_typ (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, device_type TEXT, warranty TEXT, manufacturer TEXT, product_url TEXT, image_url TEXT, comment TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)")

    scheduler.init_app(app)
    scheduler.start()
    
    app.run(debug=True)