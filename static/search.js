// currently loadest entries

entriesLoaded = 0

// execute when page done loading

window.onload = function() {

    // this fills out the type list with all curent existing types

    async function fetchData() {
        try {
            const response = await fetch('/get_all_types', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            var options = ''

            for (var i = 0; i < data.length; i++) {
                options += '<option value="' + data[i][1] + '" />';
            }

            document.getElementById('typList').innerHTML = options;

        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchData()

    var loginkey = sessionStorage.getItem("loginKey");

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
                    document.getElementById("user").innerHTML = "Beobachter";
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else{
        document.getElementById("user").innerHTML = "Beobachter";
    }
}

// deley function

const delay = ms => new Promise(res => setTimeout(res, ms));

// sends you to "/" page

function toHome(){
    window.location.href = "/"
}

// loads and displays devices

function getDevices(next){

    let deviceBox = document.getElementById('device_box');

    var param = {
        name : (document.getElementById('name').value),
        serial_number : (document.getElementById('serial_number').value),
        typ : (document.getElementById('typ').value),
        condition : (document.getElementById('condition').value),
        next : (next)
    }
    
    async function fetchData() {
        try {
            const response = await fetch('/get_next_devices', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data != null && data.length != 0) {

                document.getElementById("device_div").style = "display: block; width: 99.2%;"
                document.getElementById("load_more_box").style = "display: block;"
                document.getElementById("load_more").disabled = false;

                data.forEach(element => {

                    let mainDiv = document.createElement('div');

                    mainDiv.classList = "normal-box";
                    mainDiv.style = "width: 98%; height: 40px; margin: auto; display: flex; margin-top: 10px;";

                    // name div

                    let nameDiv = document.createElement('div');
                    let nameText = document.createElement('p');
                    let nameIconBox = document.createElement('div');
                    let nameIcon = document.createElement('span');
                    let nameInput = document.createElement('input');

                    nameDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    nameText.style = "margin: auto;";
                    nameText.innerHTML = "Name";

                    nameIconBox.classList = "normal-box";
                    nameIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    nameIcon.classList = "material-icons icons"
                    nameIcon.innerHTML = "label";

                    nameInput.classList = "input";
                    nameInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    nameInput.type = "text";
                    nameInput.readOnly = true;
                    nameInput.value = ""+element[2]+"";

                    nameIconBox.appendChild(nameIcon);

                    nameDiv.appendChild(nameText);
                    nameDiv.appendChild(nameIconBox);
                    nameDiv.appendChild(nameInput);

                    // serial_number div

                    let serial_numberDiv = document.createElement('div');
                    let serial_numberText = document.createElement('p');
                    let serial_numberIconBox = document.createElement('div');
                    let serial_numberIcon = document.createElement('span');
                    let serial_numberInput = document.createElement('a');

                    serial_numberDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    serial_numberText.style = "margin: auto;";
                    serial_numberText.innerHTML = "SN";

                    serial_numberIconBox.classList = "normal-box";
                    serial_numberIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    serial_numberIcon.classList = "material-icons icons"
                    serial_numberIcon.innerHTML = "fingerprint";

                    serial_numberInput.classList = "link";
                    serial_numberInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    serial_numberInput.innerHTML = " "+element[4]+"";
                    serial_numberInput.href = "/device/"+element[0]+""

                    serial_numberIconBox.appendChild(serial_numberIcon);

                    serial_numberDiv.appendChild(serial_numberText);
                    serial_numberDiv.appendChild(serial_numberIconBox);
                    serial_numberDiv.appendChild(serial_numberInput);

                    // typ div

                    let typDiv = document.createElement('div');
                    let typText = document.createElement('p');
                    let typIconBox = document.createElement('div');
                    let typIcon = document.createElement('span');
                    let typInput = document.createElement('a');

                    typDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    typText.style = "margin: auto;";
                    typText.innerHTML = "Gerätetyp";

                    typIconBox.classList = "normal-box";
                    typIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    typIcon.classList = "material-icons icons"
                    typIcon.innerHTML = "copy_all";

                    typInput.classList = "link";
                    typInput.style = "width: 100%; margin: auto; margin-left: 5px;";
                    typInput.innerHTML = " "+element[1]+"";
                    typInput.onclick = typLink.bind(null, element[1]);
                    typInput.href = "#"

                    typIconBox.appendChild(typIcon);

                    typDiv.appendChild(typText);
                    typDiv.appendChild(typIconBox);
                    typDiv.appendChild(typInput);

                    // condition div

                    let conditionDiv = document.createElement('div');
                    let conditionText = document.createElement('p');
                    let conditionIconBox = document.createElement('div');
                    let conditionIcon = document.createElement('span');
                    let conditionBox = document.createElement('div');
                    let conditionBoxText = document.createElement('p');

                    conditionDiv.style = "display: flex; width: 30%; margin-left: 10px;";
                    
                    conditionText.style = "margin: auto;";
                    conditionText.innerHTML = "Zustand";

                    conditionIconBox.classList = "normal-box";
                    conditionIconBox.style = "height: 28px; width: 35px; margin: auto; margin-left: 5px; display: flex; align-items: center; justify-content: center;";

                    conditionIcon.classList = "material-icons icons"
                    conditionIcon.innerHTML = "shelves";

                    var greenList = ["Aktiv"]
                    var orangeList = ["Verkauft"]
                    var redList = ["Ausgeschieden"]
                    var purpleList = ["Lager"]

                    conditionBox.classList = "normal-box"

                    if (greenList.includes(element[5])) {
                        conditionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #a5e1cd;";
                    } else if (orangeList.includes(element[5])) {
                        conditionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #ffd579;";
                    } else if (redList.includes(element[5])) {
                        conditionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #ff7d7d;";
                    } else if (purpleList.includes(element[5])) {
                        conditionBox.style = "height: 28px; margin-top: 4px; width: 100%; border-color: #CFC4FF;";
                    }

                    conditionBoxText.style = "margin-top: 4px; text-align: center;";
                    conditionBoxText.innerHTML = ""+element[5]+""

                    conditionIconBox.appendChild(conditionIcon);

                    conditionBox.appendChild(conditionBoxText)

                    conditionDiv.appendChild(conditionText);
                    conditionDiv.appendChild(conditionIconBox);
                    conditionDiv.appendChild(conditionBox);

                    mainDiv.appendChild(nameDiv);
                    mainDiv.appendChild(serial_numberDiv);
                    mainDiv.appendChild(typDiv);
                    mainDiv.appendChild(conditionDiv);
                    deviceBox.appendChild(mainDiv);
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

    document.getElementById('device_box').innerHTML = "";
    getDevices(0)
    entriesLoaded = 10
}

// this loads the next 50 in

function loadMore(){

    getDevices(entriesLoaded)
    entriesLoaded = entriesLoaded +10
}

// sends you to the type of the device

function typLink(type){

    var param = {
        name : (type),
    }
    
    async function fetchData() {
        try {
            const response = await fetch('/get_type_by_name', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data != null && data.length != 0) {
                window.location.href = "/type/"+data[0][0];
            }else{
                window.location.href = "/not_found"
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchData()
}

// this lets you export all devices in a CSV file

function exportAsCSV() {
    
    async function fetchData() {
        try {
            const response = await fetch('/get_all_devices', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (data != null) {

                function arrayToCSV(data) {
                    const headers = ["ID", "Datum", "Name", "Geräteart", "Seriennummer", "Zustand", "Standort", "Garantie in Monaten", "Kaufdatum", "Hersteller", "Produktlink", "Kommentar"];
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
                link.setAttribute('download', "Geräte "+today+".csv");

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