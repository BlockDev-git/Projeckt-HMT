// currently loadest entries

entriesLoaded = 0

// execute when page done loading

window.onload = function() {

    // this fills out fields that are given

    if (window.type != null) {

        document.getElementById('name').value = window.type;
        document.getElementById('search').click();

    }else if (window.device != null){

        document.getElementById('name').value = window.device;
        document.getElementById('search').click();
    }

    // checks if User is loged in or not and applies rights depending on User

    var loginkey = sessionStorage.getItem("loginKey");
    var currentUrl = window.location.href;

    if (loginkey != null) {

        var param = {
            key : (loginkey)
        }

        async function fetchData() {
            try {
                const response = await fetch('/check_key', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();

                if (data == true){

                    document.getElementById("user").innerHTML = "Admin";

                } else {
                    window.location.href = "/denied";
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else{
        window.location.href = "/denied"
    }
}

// deley function

const delay = ms => new Promise(res => setTimeout(res, ms));

// back to home

function toHome(){
    window.location.href = "/"
}

// loads and displays logs

function getLogs(next){

    let logBox = document.getElementById('log_box');

    var param = {
        time : (document.getElementById('date').value),
        ip : (document.getElementById('ip').value),
        object : (document.getElementById('name').value),
        action : (document.getElementById('action').value),
        next : (next)
    }
    
    async function fetchData() {
        try {
            const response = await fetch('/get_next_logs', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data != null && data.length != 0) {

                document.getElementById("log_div").style = "display: block; width: 99.2%;"
                document.getElementById("load_more_box").style = "display: block;"
                document.getElementById("load_more").disabled = false;

                data.forEach(element => {

                    let mainDiv = document.createElement('div');

                    mainDiv.classList = "normal-box";
                    mainDiv.style = "width: 98%; height: 40px; margin: auto; display: flex; margin-top: 10px;";

                    // time div

                    let timeDiv = document.createElement('div');
                    let timeText = document.createElement('p');
                    let timeIconBox = document.createElement('div');
                    let timeIcon = document.createElement('span');
                    let timeInput = document.createElement('input');

                    timeDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    timeText.style = "margin: auto;";
                    timeText.innerHTML = "Zeit";

                    timeIconBox.classList = "normal-box";
                    timeIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    timeIcon.classList = "material-icons icons"
                    timeIcon.innerHTML = "calendar_month";

                    timeInput.classList = "input";
                    timeInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    timeInput.type = "text";
                    timeInput.readOnly = true;
                    timeInput.value = ""+element[1]+"";

                    timeIconBox.appendChild(timeIcon);

                    timeDiv.appendChild(timeText);
                    timeDiv.appendChild(timeIconBox);
                    timeDiv.appendChild(timeInput);

                    // ip div

                    let ipDiv = document.createElement('div');
                    let ipText = document.createElement('p');
                    let ipIconBox = document.createElement('div');
                    let ipIcon = document.createElement('span');
                    let ipInput = document.createElement('input');

                    ipDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    ipText.style = "margin: auto;";
                    ipText.innerHTML = "IP";

                    ipIconBox.classList = "normal-box";
                    ipIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    ipIcon.classList = "material-icons icons"
                    ipIcon.innerHTML = "computer";

                    ipInput.classList = "input";
                    ipInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    ipInput.type = "text";
                    ipInput.readOnly = true;
                    ipInput.value = ""+element[2]+"";

                    ipIconBox.appendChild(ipIcon);

                    ipDiv.appendChild(ipText);
                    ipDiv.appendChild(ipIconBox);
                    ipDiv.appendChild(ipInput);

                    // object div

                    let objectDiv = document.createElement('div');
                    let objectText = document.createElement('p');
                    let objectIconBox = document.createElement('div');
                    let objectIcon = document.createElement('span');
                    let objectInput = document.createElement('input');

                    objectDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    objectText.style = "margin: auto;";
                    objectText.innerHTML = "Gerät / Typ";

                    objectIconBox.classList = "normal-box";
                    objectIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    objectIcon.classList = "material-icons icons"
                    objectIcon.innerHTML = "label";

                    objectInput.classList = "input";
                    objectInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    objectInput.type = "text";
                    objectInput.readOnly = true;
                    objectInput.value = ""+element[3]+"";

                    objectIconBox.appendChild(objectIcon);

                    objectDiv.appendChild(objectText);
                    objectDiv.appendChild(objectIconBox);
                    objectDiv.appendChild(objectInput);

                    // action div

                    let actionDiv = document.createElement('div');
                    let actionText = document.createElement('p');
                    let actionIconBox = document.createElement('div');
                    let actionIcon = document.createElement('span');
                    let actionBox = document.createElement('div');
                    let actionBoxText = document.createElement('p');

                    actionDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    actionText.style = "margin: auto;";
                    actionText.innerHTML = "Aktion";

                    actionIconBox.classList = "normal-box";
                    actionIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    actionIcon.classList = "material-icons icons"
                    actionIcon.innerHTML = "bolt";

                    var greenList = ["Typ Erstellt","Gerät Erstellt"]
                    var orangeList = ["Passwortänderung","Anmeldung","Abmeldung"]
                    var redList = ["Typ Gelöscht","Gerät Gelöscht"]
                    var purpleList = ["Typ Aktualisiert","Gerät Aktualisiert"]

                    actionBox.classList = "normal-box"

                    if (greenList.includes(element[4])) {
                        actionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #a5e1cd;";
                    } else if (orangeList.includes(element[4])) {
                        actionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #ffd579;";
                    } else if (redList.includes(element[4])) {
                        actionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #ff7d7d;";
                    } else if (purpleList.includes(element[4])) {
                        actionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #CFC4FF;";
                    }

                    actionBoxText.style = "margin-top: 4px; text-align: center;";
                    actionBoxText.innerHTML = ""+element[4]+""

                    actionIconBox.appendChild(actionIcon);

                    actionBox.appendChild(actionBoxText)

                    actionDiv.appendChild(actionText);
                    actionDiv.appendChild(actionIconBox);
                    actionDiv.appendChild(actionBox);

                    // info div

                    let infoDiv = document.createElement('div');
                    let infoText = document.createElement('p');
                    let infoIconBox = document.createElement('div');
                    let infoIcon = document.createElement('span');
                    let infoInput = document.createElement('input');

                    infoDiv.style = "display: flex; width: 50%; margin-left: 10px;";
                    
                    infoText.style = "margin: auto;";
                    infoText.innerHTML = "Deteils";

                    infoIconBox.classList = "normal-box";
                    infoIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    infoIcon.classList = "material-icons icons"
                    infoIcon.innerHTML = "info";

                    infoInput.classList = "input";
                    infoInput.style = "width: 100%; margin: auto; margin-left: 5px; margin-right: 5px;";
                    infoInput.type = "text";
                    infoInput.readOnly = true;
                    infoInput.value = ""+element[5]+"";

                    infoIconBox.appendChild(infoIcon);

                    infoDiv.appendChild(infoText);
                    infoDiv.appendChild(infoIconBox);
                    infoDiv.appendChild(infoInput);

                    mainDiv.appendChild(timeDiv);
                    mainDiv.appendChild(ipDiv);
                    mainDiv.appendChild(objectDiv);
                    mainDiv.appendChild(actionDiv);
                    mainDiv.appendChild(infoDiv);
                    logBox.appendChild(mainDiv);
                });

            }else {
                document.getElementById("load_more").disabled = true;
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData()
}

// this is to load the first 50 logs in

function search(){

    document.getElementById('log_box').innerHTML = "";
    getLogs(0)
    entriesLoaded = 10
}

// this loads the next 50 in

function loadMore(){

    getLogs(entriesLoaded)
    entriesLoaded = entriesLoaded +10
}

// this lets you export all logs in a CSV file

function exportAsCSV() {

    var param = {
        time : (""),
        ip : (""),
        object : (""),
        action : ("")
    }
    
    async function fetchData() {
        try {
            const response = await fetch('/get_all_logs', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data != null) {

                function arrayToCSV(data) {
                    const headers = ["ID", "Datum", "IP Adresse", "Object", "Aktion", "Details"];
                    const rows = data.map(row => 
                        row.map(item => `"${item}"`).join(',')
                    );

                    return [headers.join(','), ...rows].join('\n');
                }

                const csvContent = arrayToCSV(data);
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = dd + '-' + mm + '-' + yyyy;

                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', "log "+today+".csv");

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData()
}