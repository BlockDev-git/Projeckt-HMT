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

* flask
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

#### Windows 🪟
```
python app.py oder py app.py
```
#### Linux 🐧
```
python3 app.py
```
#### Mac OS 🍏
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

### Nutzung 🛠️
Sobald du nun die Anwendung im Browser öffnest, wirst du bemerken, dass wenige Funktionen angezeigt werden. Das liegt daran, dass du als Beobachter angemeldet bist. Um mehrere Funktionen freizuschalten, musst du dich zuerst anmelden. Das geht, indem du auf das Benutzer-Icon oben rechts klickst Melde dich nun als Admin an. Das Passwort dafür ist `4admin`. Das sollte so schnell wie möglich geändert werden. Dafür muss die Option „Passwort ändern“ angeklickt werden. Nun solltest du als Admin mehr Funktionen freigeschaltet haben.

#### Typ erstellen 📃

Typen dienen wie eine Schablone. Es werden keine einzigartigen Daten eingegeben, sondern nur Randdaten, die auf mehrere Geräte in der Zukunft zutreffen werden. Die Erstellung eines Typs ist sehr einfach. Öffne auf der Startseite die Option „Typ erstellen“. Fülle nun die Informationen in die einzelnen Informationsfelder ein. Am Schluss muss der „Erstellen“-Button betätigt werden, um den Typ zu erstellen. Nach dem Erstellen kann der Typ aktualisiert, Logs können angezeigt oder gelöscht werden.

#### Gerät erstellen 💻

Geräte beinhalten einzigartige Daten. Öffne auf der Startseite die Option „Gerät erstellen“. Um das Erstellen von vielen Geräten zu erleichtern, können die von ihnen erstellten Typen ausgewählt werden. Diese füllen daraufhin automatisch allgemeine Informationsfelder aus. Die Informationen in diesen Feldern können bei Fehlern ausgebessert werden. Zusätzlich können die einzigartigen Informationen in die Felder eingetragen werden. Am Schluss muss der „Erstellen“-Button betätigt werden, um das Gerät zu erstellen. Nach dem Erstellen kann das Gerät aktualisiert, Logs angezeigt und QR-Codes erstellt oder gelöscht werden.

#### Geräte suchen 🔎

In der Anwendung gibt es zwei Möglichkeiten, Geräte zu suchen. Eine Möglichkeit ist die Suchfunktion. Mit dieser kann man durch Filter die Suchergebnisse einschränken. Sobald das bestimmte Gerät gefunden wurde, kann man die Seriennummer auswählen, um auf das Gerät zu springen. In manchen Fällen ist es praktischer, eine Liste von allen Geräten zu haben. Dies ist durch die Exportfunktion möglich. Die Exportfunktion liefert Ihnen alle Geräte in einer Liste als CSV-Datei. Die andere Möglichkeit ist die QR-Code-Funktion. Wie Sie vielleicht schon mitbekommen haben, können Sie für jedes Gerät einen QR-Code erstellen. Mit dem QR-Code gelangen Sie direkt zum Gerät, ohne danach direkt suchen zu müssen.


#### Logs auslesen 📑

> **Hinweis** ⚠️
Die Logs werden nur 30 Tage lang gespeichert. Logs älter als 30 Tage werden automatisch gelöscht. Der Grund dafür ist, dass die Datenbank nicht zu groß wird.

Die Anwendung bietet eine Logfunktion, um Änderungen genau zu dokumentieren. Die Logs beinhalten folgende Daten: Datum, IP-Adresse, Objekt, Aktion und Details. Alle Logs innerhalb von 30 Tagen können als CSV-Datei exportiert werden. Dadurch können Logs auch länger als 30 Tage aufbewahrt werden.

