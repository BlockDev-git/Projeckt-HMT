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

@app.route("/creat_type")
def creatType():
    return render_template("type.html")

@app.route("/type/<typeID>")
def type(typeID):
    return render_template("type.html")

@app.route("/creat_device")
def creatDevice():
    return render_template("device.html")

@app.route("/device/<deviceID>")
def device(deviceID):
    return render_template("device.html")

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

    corsor.execute("select * from connections where key=:key", {"key": key})
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

    corsor.execute("delete from connections where key=:key", {"key": str(key)})
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
            corsor.execute("delete from connections where id=:id", {"id": row[0]})
            connection.commit() 
    
    connection.close()

# ---------------- Type ----------------

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
    time = datetime.now()

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM device_typ WHERE name=:name",{"name": str(name)})
    item = cursor.fetchall()

    print(item)

    if item == []:
        cursor.execute("INSERT INTO device_typ (name, device_type, warranty, manufacturer, product_url, image_url, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (name, device_type, warranty, manufacturer, product_url, image_url, comment, time))
        connection.commit()
        cursor.execute("SELECT id FROM device_typ WHERE created_at=:created_at",{"created_at": str(time)})
        item = cursor.fetchall()
        connection.close()

        return jsonify(True, item)
    
    connection.close()
    return jsonify(False, None)

@app.route('/get_type', methods=['POST'])
def get_type():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device_typ WHERE id=:id",{"id": str(id)})
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

@app.route('/delete_type', methods=['POST'])
def delete_type():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM device_typ WHERE id=:id",{"id": str(id)})

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

    cursor.execute("UPDATE device_typ SET name=:name, device_type=:device_type, warranty=:warranty, manufacturer=:manufacturer, product_url=:product_url, image_url=:image_url, comment=:comment WHERE id=:id", {"id": id, "name": name, "device_type": device_type, "warranty": warranty, "manufacturer": manufacturer, "product_url": product_url, "image_url": image_url, "comment": comment})
    connection.commit()
    connection.close()

    return jsonify(True)

# ---------------- Device ----------------

@app.route('/add_device', methods=['POST'])
def add_device():

    data = request.json
    typ = data['param']['typ']
    name = data['param']['name']
    device_type = data['param']['device_type']
    serial_number = data['param']['serial_number']
    condition = data['param']['condition']
    warranty = data['param']['warranty']
    purchase = data['param']['purchase']
    manufacturer = data['param']['manufacturer']
    product_url = data['param']['product_url']
    image_url = data['param']['image_url']
    comment = data['param']['comment']
    time = datetime.now()

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT serial_number FROM device WHERE serial_number=:serial_number",{"serial_number": str(serial_number)})
    item = cursor.fetchall()

    if item == []:
        cursor.execute("INSERT INTO device (typ, name, device_type, serial_number, condition, warranty, purchase, manufacturer, product_url, image_url, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (typ, name, device_type, serial_number, condition, warranty, purchase, manufacturer, product_url, image_url, comment, time))
        connection.commit()
        cursor.execute("SELECT id FROM device WHERE created_at=:created_at",{"created_at": str(time)})
        item = cursor.fetchall()
        connection.close()

        return jsonify(True, item)
    
    connection.close()
    return jsonify(False, None)

@app.route('/get_device', methods=['POST'])
def get_device():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device WHERE id=:id",{"id": str(id)})
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

@app.route('/delete_device', methods=['POST'])
def delete_device():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM device WHERE id=:id",{"id": str(id)})

    connection.commit()
    connection.close()

    return jsonify(True)

@app.route('/update_device', methods=['POST'])
def update_device():
    data = request.json
    id = data['param']['id']
    typ = data['param']['typ']
    name = data['param']['name']
    device_type = data['param']['device_type']
    serial_number = data['param']['serial_number']
    condition = data['param']['condition']
    warranty = data['param']['warranty']
    purchase = data['param']['purchase']
    manufacturer = data['param']['manufacturer']
    product_url = data['param']['product_url']
    image_url = data['param']['image_url']
    comment = data['param']['comment']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("UPDATE device SET typ=:typ, name=:name, device_type=:device_type, serial_number=:serial_number, condition=:condition, warranty=:warranty, purchase=:purchase, manufacturer=:manufacturer, product_url=:product_url, image_url=:image_url, comment=:comment WHERE id=:id", {"id": id, "typ": typ , "name": name, "device_type": device_type, "serial_number": serial_number, "condition": condition ,"warranty": warranty, "purchase": purchase, "manufacturer": manufacturer, "product_url": product_url, "image_url": image_url, "comment": comment})
    connection.commit()
    connection.close()

    return jsonify(True)

# ---------------- Search ----------------

@app.route('/search_device', methods=['POST'])
def search_device():

    data = request.json
    name = data['param']['name']
    serial_number = data['param']['serial_number']
    typ = data['param']['typ']
    condition = data['param']['condition']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device WHERE name LIKE :name AND serial_number LIKE :serial_number AND typ LIKE :typ AND condition LIKE :condition", {"name": '%'+str(name)+'%', "typ": '%'+str(typ)+'%', "serial_number": '%'+str(serial_number)+'%', "condition": '%'+str(condition)+'%'})
    devices = cursor.fetchall()
    connection.commit()
    connection.close()

    print(devices)




    # data = request.json
    # #query = data['param']['query']
    # field = data['param'].get('field')  # optional: "name", "serial_number", "typ", "condition", ...

    # connection = sqlite3.connect("Database.db")
    # cursor = connection.cursor()

    # if field in ["name", "serial_number", "typ", "condition"]:
    #     sql = f"SELECT * FROM device WHERE {field} LIKE :q"
    #     cursor.execute(sql, {"q": f"%{query}%"})
    # else:
    #     cursor.execute("""
    #         SELECT * FROM device
    #         WHERE name LIKE :q
    #             OR name LIKE :q
    #             OR serial_number LIKE :q
    #             OR typ LIKE :q
    #             OR condition LIKE :q
    #     """, {"q": f"%{query}%"})

    # results = cursor.fetchall()
    # connection.close()

    # devices = [{
    #     "id": r[0],
    #     "name": r[1],
    #     "device_type": r[2],
    #     "warranty": r[3],
    #     "manufacturer": r[4],
    #     "product_url": r[5],
    #     "image_url": r[6],
    #     "comment": r[7],
    #     "created_at": r[8]
    # } for r in results]

    return jsonify(data)
 
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

    # Device-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY AUTOINCREMENT, typ TEXT, name TEXT, device_type TEXT, serial_number TEXT, condition TEXT, warranty TEXT, purchase TEXT, manufacturer TEXT, product_url TEXT, image_url TEXT, comment TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)")

    scheduler.init_app(app)
    scheduler.start()
    
    app.run(debug=True)