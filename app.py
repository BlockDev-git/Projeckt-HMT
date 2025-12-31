from flask import Flask, render_template ,jsonify ,request, send_file, Response
from flask_apscheduler import APScheduler
from datetime import datetime, timedelta
import sqlite3
from PIL import Image
import hashlib
import uuid
import bcrypt
import io
import qrcode
#import socket
#from zeroconf import IPVersion, ServiceInfo, Zeroconf

app = Flask(__name__)
scheduler = APScheduler()

# ---------------- ROUTES ----------------

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/denied")
def denied():
    return render_template("denied.html")

@app.route("/not_found")
def not_found():
    return render_template("not_found.html")

@app.route("/log")
def log():
    return render_template("log.html")

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

# checks if the password is correct or not

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

        corsor.execute("INSERT INTO connections (key) VALUES (?)", [key])
        #corsor.execute("INSERT INTO connections (key, expiration) VALUES (?, ?)", [key, expiration])
        corsor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", ["", "Anmeldung", "Admin Benutzer ist nun angemeldet"])
        connection.commit() 
        connection.close()

        return jsonify([True, key])
    else:
        return jsonify([False, None])

# checks if the client key matches with any of the server keys

def check_key(key):

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("select * from connections where key=:key", {"key": key})
    search = corsor.fetchall()
    connection.close()

    if search != []:
        return True
    else:
        return False
    
# this only to forward the key function check_key and send the reply back to the client

@app.route('/check_key', methods=['POST'])
def check_key_request():
    
    data = request.json
    key = data['param']['key']

    reply = check_key(key)
    return jsonify(reply)
    
# updates the existing password
    
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
    cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", ["", "Passwortänderung", "Passwort wurde für den Admin Benutzer geändert"])
    connection.commit()
    connection.close()

    return jsonify(True)

# logs you out of the admin ac
    
@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    key = data['param']['key']

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    corsor.execute("delete from connections where key=:key", {"key": str(key)})
    corsor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", ["", "Abmeldung", "Admin Benutzer ist nun abgemeldet"])
    connection.commit()
    connection.close()

    return "200"

# runs every 10 sec and this is for the expiration dates of the Server keys

@scheduler.task('interval', id='task', seconds=10)
def task():
    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    for row in corsor.execute("SELECT * FROM connections WHERE created_at < DATETIME('now', 'localtime', '-9 minutes')"):

        corsor.execute("delete from connections where id=:id", {"id": row[0]})
        corsor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", ["", "Abmeldung", "Admin Benutzer ist nun abgemeldet"])
        connection.commit() 
    
    connection.close()

# ---------------- Type ----------------

# this is for adding a new typ

@app.route('/add_type', methods=['POST'])
def add_type():

    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        name = data['param']['name']
        device_type = data['param']['device_type']
        warranty = data['param']['warranty']
        manufacturer = data['param']['manufacturer']
        product_url = data['param']['product_url']
        comment = data['param']['comment']
        time = datetime.now()

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        cursor.execute("SELECT name FROM device_typ WHERE name=:name",{"name": str(name)})
        item = cursor.fetchall()

        if item == []:
            cursor.execute("INSERT INTO device_typ (name, device_type, warranty, manufacturer, product_url, img_hash, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (name, device_type, warranty, manufacturer, product_url, "", comment, time))
            cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(name), "Typ Erstellt", "Der Typ: "+str(name)+" wurde erstellt"])
            connection.commit()
            cursor.execute("SELECT id FROM device_typ WHERE created_at=:created_at",{"created_at": str(time)})
            item = cursor.fetchall()
            connection.close()

            return jsonify(True, "success", [item])
        
        connection.close()
        return jsonify(False, "exists")
    else:
        return jsonify(False, "denied")

# gives all the data of a typ with only the "name" of the typ

@app.route('/get_type_by_name', methods=['POST'])
def get_type_by_name():
    data = request.json
    name = data['param']['name']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device_typ WHERE name=:name",{"name": str(name)})
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

# gives all the data of a typ with only the "id" of the typ

@app.route('/get_type_by_id', methods=['POST'])
def get_type_by_id():
    data = request.json
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device_typ WHERE id=:id",{"id": str(id)})
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

# gives all the data of all currently existing typs

@app.route('/get_all_types', methods=['POST'])
def get_all_types():

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM device_typ")
    search = cursor.fetchall()
    connection.close()

    return jsonify(search)

# delete an existing typ

@app.route('/delete_type', methods=['POST'])
def delete_type():
        
    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        id = data['param']['id']

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        img_not_in_use("typ", id)

        cursor.execute("SELECT name FROM device_typ WHERE id=:id",{"id": str(id)})
        name = cursor.fetchall()

        cursor.execute("DELETE FROM device_typ WHERE id=:id",{"id": str(id)})
        cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(name[0][0]), "Typ Gelöscht", "Der Typ: "+str(name[0][0])+" wurde gelöscht"])
        
        connection.commit()
        connection.close()

        return jsonify(True, "success")
    else:
        return jsonify(False, "denied")

# update an existing typ

@app.route('/update_type', methods=['POST'])
def update_type():

    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        name = data['param']['name']
        id = data['param']['id']

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM device_typ WHERE name=:name",{"name": str(name)})
        item = cursor.fetchall()

        if item == [] or str(item[0][0]) == str(id):

            device_type = data['param']['device_type']
            warranty = data['param']['warranty']
            manufacturer = data['param']['manufacturer']
            product_url = data['param']['product_url']
            comment = data['param']['comment']

            img_not_in_use("typ", id)

            cursor.execute("UPDATE device_typ SET name=:name, device_type=:device_type, warranty=:warranty, manufacturer=:manufacturer, product_url=:product_url, img_hash=:img_hash, comment=:comment WHERE id=:id", {"id": id, "name": name, "device_type": device_type, "warranty": warranty, "manufacturer": manufacturer, "product_url": product_url, "img_hash": "", "comment": comment})
            cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(name), "Typ Aktualisiert", "Der Typ: "+str(name)+" wurde aktualisiert"])
            connection.commit()
            connection.close()

            return jsonify(True, "success")

        connection.close()
        return jsonify(False, "exists")
    else:
        return jsonify(False, "denied")

# ---------------- Device ----------------

# this is for adding a new device

@app.route('/add_device', methods=['POST'])
def add_device():

    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        typ = data['param']['typ']
        name = data['param']['name']
        device_type = data['param']['device_type']
        serial_number = data['param']['serial_number']
        condition = data['param']['condition']
        location = data['param']['location']
        warranty = data['param']['warranty']
        purchase = data['param']['purchase']
        manufacturer = data['param']['manufacturer']
        product_url = data['param']['product_url']
        comment = data['param']['comment']
        time = datetime.now()

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        cursor.execute("SELECT serial_number FROM device WHERE serial_number=:serial_number",{"serial_number": str(serial_number)})
        item = cursor.fetchall()

        if item == []:
            cursor.execute("INSERT INTO device (typ, name, device_type, serial_number, condition, location, warranty, purchase, manufacturer, product_url, img_hash, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (typ, name, device_type, serial_number, condition, location, warranty, purchase, manufacturer, product_url, "", comment, time))
            cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(serial_number), "Gerät Erstellt", "Das Gerät: "+str(serial_number)+" wurde erstellt"])
            connection.commit()
            cursor.execute("SELECT id FROM device WHERE created_at=:created_at",{"created_at": str(time)})
            item = cursor.fetchall()
            connection.close()

            return jsonify(True, "success", item)
        
        connection.close()
        return jsonify(False, "exists")
    else:
        return jsonify(False, "denied")

# gives all the data of a device with only the "id" of the device

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

# delete an existing device

@app.route('/delete_device', methods=['POST'])
def delete_device():

    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        id = data['param']['id']

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        img_not_in_use("device", id)

        cursor.execute("SELECT serial_number FROM device WHERE id=:id",{"id": str(id)})
        sn = cursor.fetchall()

        cursor.execute("DELETE FROM device WHERE id=:id",{"id": str(id)})
        cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(sn[0][0]), "Gerät Gelöscht", "Das Gerät: "+str(sn[0][0])+" wurde gelöscht"])
        
        connection.commit()
        connection.close()

        return jsonify(True, "success")
    else:
        return jsonify(False, "denied")
    
# update an existing device

@app.route('/update_device', methods=['POST'])
def update_device():

    data = request.json
    key = data['param']['key']

    if (check_key(key) == True):

        serial_number = data['param']['serial_number']
        id = data['param']['id']

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM device WHERE serial_number=:serial_number",{"serial_number": str(serial_number)})
        item = cursor.fetchall()

        if item == [] or str(item[0][0]) == str(id):

            typ = data['param']['typ']
            name = data['param']['name']
            device_type = data['param']['device_type']
            condition = data['param']['condition']
            location = data['param']['location']
            warranty = data['param']['warranty']
            purchase = data['param']['purchase']
            manufacturer = data['param']['manufacturer']
            product_url = data['param']['product_url']
            comment = data['param']['comment']

            connection = sqlite3.connect("Database.db")
            cursor = connection.cursor()

            cursor.execute("UPDATE device SET typ=:typ, name=:name, device_type=:device_type, serial_number=:serial_number, condition=:condition, location=:location, warranty=:warranty, purchase=:purchase, manufacturer=:manufacturer, product_url=:product_url, img_hash=:img_hash, comment=:comment WHERE id=:id", {"id": id, "typ": typ , "name": name, "device_type": device_type, "serial_number": serial_number, "condition": condition, "location": location, "warranty": warranty, "purchase": purchase, "manufacturer": manufacturer, "product_url": product_url, "img_hash": "", "comment": comment})
            cursor.execute("INSERT INTO log (object, action, details) VALUES (?, ?, ?)", [str(serial_number), "Gerät Aktualisiert", "Das Gerät: "+str(serial_number)+" wurde aktualisiert"])
            connection.commit()
            connection.close()

            return jsonify(True, "success")

        connection.close()
        return jsonify(False, "exists")
    else:
        return jsonify(False, "denied")

# ---------------- Search ----------------

# get all devices where "name" , "serial_number" , "typ" and "condition" match

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

    return jsonify(data)

# ---------------- LOG ----------------

# get all devices where "name" , "serial_number" , "typ" and "condition" match

@app.route('/get_all_logs', methods=['POST'])
def get_all_logs():

    data = request.json
    time = data['param']['time']
    object = data['param']['object']
    action = data['param']['action']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM log WHERE created_at LIKE :time AND object LIKE :object AND action LIKE :action ORDER BY created_at DESC", {"time": '%'+str(time)+'%', "object": '%'+str(object)+'%', "action": '%'+str(action)+'%'})
    logs = cursor.fetchall()
    connection.close()

    return jsonify(logs)

@app.route('/get_next_logs', methods=['POST'])
def get_next_logs():

    data = request.json
    time = data['param']['time']
    object = data['param']['object']
    action = data['param']['action']
    next = data['param']['next']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM log WHERE created_at LIKE :time AND object LIKE :object AND action LIKE :action ORDER BY created_at DESC LIMIT 10 OFFSET :next", {"time": '%'+str(time)+'%', "object": '%'+str(object)+'%', "action": '%'+str(action)+'%', "next": int(next)})
    logs = cursor.fetchall()
    connection.close()

    return jsonify(logs)

# runs every 10 min and deketes logs older then 30 days

@scheduler.task('interval', id='expiration_log_task', seconds=600)
def expiration_log_task():

    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    for row in corsor.execute("SELECT * FROM log WHERE created_at < DATE('now', 'localtime', '-29 days')"):

        corsor.execute("DELETE FROM log WHERE id=:id", {"id": row[0]})
        connection.commit() 
    
    connection.close()

# ---------------- Image Upload ----------------

# this deletes not used img

def img_not_in_use(table, id):

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()
    img_hash = None

    if table == "typ":

        cursor.execute("SELECT img_hash FROM device_typ WHERE id=:id",{"id": str(id)})
        img_hash = cursor.fetchall()
        
    elif table == "device":

        cursor.execute("SELECT img_hash FROM device WHERE id=:id",{"id": str(id)})
        img_hash = cursor.fetchall()

    if img_hash[0][0] != "":

        cursor.execute("SELECT COUNT(id) FROM device_typ WHERE img_hash=:img_hash",{"img_hash": str(img_hash[0][0])})
        img_count_typ = cursor.fetchall()

        cursor.execute("SELECT COUNT(id) FROM device WHERE img_hash=:img_hash",{"img_hash": str(img_hash[0][0])})
        img_count_device = cursor.fetchall()

        if (img_count_device[0][0] + img_count_typ[0][0]) == 1:

            cursor.execute("DELETE FROM images WHERE img_hash=:img_hash",{"img_hash": str(img_hash[0][0])})
            connection.commit()
            connection.close()

            return jsonify(True)

        else:

            connection.close()
            return jsonify(True)

    else:

        connection.close()
        return jsonify(True)

# this is for uploading new imgs

@app.route('/upload', methods=['POST'])
def upload_file():

    id = request.form.get('id')
    table = request.form.get('table')
    update = request.form.get('update')

    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    img_not_in_use(table, id)

    try:
        img = Image.open(file.stream)
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        img.thumbnail((500, 500))

        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=70, optimize=True)
        compressed_data = buffer.getvalue()

        file_hash = hashlib.md5(compressed_data).hexdigest()

        connection = sqlite3.connect("Database.db")
        cursor = connection.cursor()

        cursor.execute("SELECT img_hash FROM images WHERE img_hash=:img_hash",{"img_hash": str(file_hash)})
        item = cursor.fetchall()

        if item == []:

            cursor.execute("INSERT INTO images (img_name, img_hash, img_data) VALUES (?, ?, ?)", (file.filename, file_hash, compressed_data))
            connection.commit()

            if table == "typ":

                cursor.execute("UPDATE device_typ SET img_hash=:img_hash WHERE id=:id", {"id": id, "img_hash": file_hash})
                connection.commit()
                connection.close()
                return jsonify(True, file_hash)

            elif table == "device":

                cursor.execute("UPDATE device SET img_hash=:img_hash WHERE id=:id", {"id": id, "img_hash": file_hash})
                connection.commit()
                connection.close()
                return jsonify(True, file_hash)

        else:

            if table == "typ":

                cursor.execute("UPDATE device_typ SET img_hash=:img_hash WHERE id=:id", {"id": id, "img_hash": file_hash})
                connection.commit()
                connection.close()
                return jsonify(True, file_hash)

            elif table == "device":

                cursor.execute("UPDATE device SET img_hash=:img_hash WHERE id=:id", {"id": id, "img_hash": file_hash})
                connection.commit()
                connection.close()
                return jsonify(True, file_hash)

    except Exception as e:
        return jsonify(False, str(e))

# this gives you the blob data of an img  

@app.route('/get_img/<img_hash>')
def get_img(img_hash):

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT img_data FROM images WHERE img_hash=:img_hash",{"img_hash": str(img_hash)})
    item = cursor.fetchone()
    connection.close()

    return send_file(io.BytesIO(item[0]), mimetype='image/jpeg')

# gives you the name of an img

@app.route('/get_img_name/<img_hash>')
def get_img_name(img_hash):

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT img_name FROM images WHERE img_hash=:img_hash",{"img_hash": str(img_hash)})
    item = cursor.fetchall()
    connection.close()

    return jsonify(item)

# add img_hash to device by typ

@app.route('/add_img_by_typ', methods=['POST'])
def add_img_by_typ():

    data = request.json
    name = data['param']['name']
    id = data['param']['id']

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT img_hash FROM device_typ WHERE name=:name",{"name": str(name)})
    img_hash = cursor.fetchall()

    if len(img_hash) > 0:
        
        cursor.execute("UPDATE device SET img_hash=:img_hash WHERE id=:id", {"id": id, "img_hash": str(img_hash[0][0])})
        connection.commit()

    connection.close()
    return "200"

# ---------------- QR-Code ----------------

# this generates a qr code for the current device

@app.route('/generate_qr', methods=['POST'])
def generate_qr():

    data = request.json
    url = data['param']['url']

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

# ---------------- PIE CHART ----------------

# gets all the device info to display later a pie chart

@app.route('/device_status_stats', methods=['GET'])
def device_status_stats():
    ALL_STATUS = ["Aktiv", "Lager", "Defekt", "In Reparatur"]

    connection = sqlite3.connect("Database.db")
    cursor = connection.cursor()

    cursor.execute("SELECT condition, COUNT(*) FROM device GROUP BY condition")
    rows = cursor.fetchall()
    connection.close()

    stats = {status: 0 for status in ALL_STATUS}

    for status, count in rows:
        if status in stats:
            stats[status] = count

    return jsonify(stats)


# ---------------- mDNS ----------------

# def register_service():
#     # get local IP address
#     s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#     s.connect(("8.8.8.8", 80))
#     local_ip = s.getsockname()[0]
#     s.close()

#     # define service details
#     desc = {'path': '/'}
#     info = ServiceInfo(
#         "_http._tcp.local.",
#         "Flask-Server._http._tcp.local.",
#         addresses=[socket.inet_aton(local_ip)],
#         port=5000,
#         properties=desc,
#         server="hmt.local.",
#     )

#     # register service
#     zc = Zeroconf(ip_version=IPVersion.All)
#     print(f"Registering service as hmt.local on {local_ip}...")
#     zc.register_service(info)
#     return zc, info
 
if __name__ == '__main__':

    # DB Connection
    connection = sqlite3.connect("Database.db")
    corsor = connection.cursor()

    # User-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, salt TEXT)")
    corsor.execute("SELECT * FROM users WHERE username=?", ("admin",))
    if corsor.fetchone() is None:

        password = b'4admin' # Default Passwort soll bei benutzung geändert werden
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt)

        corsor.execute("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)", ["admin", hashed, salt])
    
    connection.commit()

    # Connections-Tabelle
    #corsor.execute("CREATE TABLE IF NOT EXISTS connections (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, expiration DATETIME)")
    corsor.execute("CREATE TABLE IF NOT EXISTS connections (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, created_at DATETIME DEFAULT (datetime('now','localtime')))")

    # Type-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS device_typ (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, device_type TEXT, warranty TEXT, manufacturer TEXT, product_url TEXT, img_hash, comment TEXT, created_at DATETIME DEFAULT (datetime('now','localtime')))")

    # Device-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY AUTOINCREMENT, typ TEXT, name TEXT, device_type TEXT, serial_number TEXT, condition TEXT, location TEXT, warranty TEXT, purchase TEXT, manufacturer TEXT, product_url TEXT, img_hash TEXT, comment TEXT, created_at DATETIME DEFAULT (datetime('now','localtime')))")

    # Image-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, img_name TEXT, img_hash TEXT, img_data BLOB, created_at DATETIME DEFAULT (datetime('now','localtime')))")

    # Log-Tabelle
    corsor.execute("CREATE TABLE IF NOT EXISTS log (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT (datetime('now','localtime')), object TEXT, action TEXT, details TEXT)")

    # start log tasks and key expiration task
    scheduler.init_app(app)
    scheduler.start()

    # start server on http://127.0.0.1:5000
    #app.run(debug=True)

    # start server on http://[curent ip of the device]:5000
    app.run(host='0.0.0.0', port=5000, debug=True)

    # start server on http://hmt.local:5000
    # zc, info = register_service()
    
    # try:
    #     # Run Flask (setting host to 0.0.0.0 is required)
    #     app.run(host='0.0.0.0', port=5000, debug=False)
    # finally:
    #     # Cleanup on exit
    #     print("Unregistering...")
    #     zc.unregister_service(info)
    #     zc.close()
