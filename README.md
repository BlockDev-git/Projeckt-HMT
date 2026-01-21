## Hallo Schön, dass du hier bist. 👋
Hier wirst du eine kleine Einführung bekommen, von was überhaupt HMT ist bis zur wirklichen Nutzung.

## Infos ℹ️
> **Hinweis** ⚠️
Die Nutzung von HMT in einer produktiven Umgebung ist nicht empfohlen, da dies nur ein Prototyp ist. Das heißt, es können Fehler existieren. Außerdem wurde als Server Flask verwendet. Dieser ist für die Produktion nicht geeignet.

### Was ist HMT (Hardware Management Tool)? ❔
HMT hilft dir, den Überblick über deine Hardware zu verschaffen. Dadurch weißt du wo sich deine Hardware aktuell befindet. HMT bietet eine übersichtliche und leicht bedienbare Benutzeroberfläche. In der Oberfläche können ganz leicht Typen (Schablonen) und Geräte angelegt werden. Die angelegten Geräte können daraufhin wieder angezeigt werden und als CSV exportiert werden. Um Geräte einfacher suchen zu können, kann für jedes Gerät ein QR-Code generiert werden. Dies erleichtert die Suche ungemein. Dies ist nur der Anfang HMT bietet noch viele andere Funktionen.

### Aufbau 🏗️
HMT verwendet im Backend Python als Scriptsprache Für den Server wird Flask verwendet (in Produktion nicht geeignet). Als Datenbank wird SQL-Lite verwendet und zuguterletzt als Frontendsprache wird Javascript verwendet.

## Praxis 📚
### Installation von HMT 💾
Bevor du „app.py“ ausführst, müssen folgende Python-Pakete installiert sein.

* lask
* flask_apscheduler
* datetime
* sqlite3
* PIL
* hashlib
* uuid
* bcrypt
* io
* qrcode

Um nun die „app.py“ muss folgender Befehl ausgeführt werden:

#### Windows:

```
python app.py oder py app.py
```

#### Linux:
```
python3 app.py
```

#### Mac OS:
```
python3 app.py
```
Nach Ausführung des Befehls sollte in der Kommandozeile Folgendes angezeigt werden:

```
Running on http://127.0.0.1:5000
Running on http://[IP Adresse von deinem Gerät]:5000
Press CTRL+C to quit
  Restarting with stat
  Debugger is active!
  Debugger PIN: 117-034-467
```
Nun sollte in dem Ordner, wo auch das Python-Script „app.py“ sich befindet, eine Datenbank existieren.
