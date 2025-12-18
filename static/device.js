window.onload = function() {

    let bar = document.getElementById('bar');

    function editAll() {

        document.getElementById('typ').readOnly = false;
        document.getElementById('name').readOnly = false;
        document.getElementById('device_type').readOnly = false;
        document.getElementById('serial_number').readOnly = false;
        document.getElementById('condition').readOnly = false;
        document.getElementById('warranty').readOnly = false;
        document.getElementById('purchase').readOnly = false;
        document.getElementById('manufacturer').readOnly = false;
        document.getElementById('product_url').readOnly = false;
        document.getElementById('image_url').readOnly = false;
        document.getElementById('comment').readOnly = false;
    }

    function readAll() {

        document.getElementById('typ').readOnly = true;
        document.getElementById('name').readOnly = true;
        document.getElementById('device_type').readOnly = true;
        document.getElementById('serial_number').readOnly = true;
        document.getElementById('condition').readOnly = true;
        document.getElementById('warranty').readOnly = true;
        document.getElementById('purchase').readOnly = true;
        document.getElementById('manufacturer').readOnly = true;
        document.getElementById('product_url').readOnly = true;
        document.getElementById('image_url').readOnly = true;
        document.getElementById('comment').readOnly = true;
    }

    function addCreat() {

        let creatBtn = document.createElement('button');

        creatBtn.id = "creat";
        creatBtn.innerHTML = "Gerät anlegen";
        creatBtn.onclick = creatDevice.bind(null);

        bar.appendChild(creatBtn);
    }

    function addQR() {

        let creatBtn = document.createElement('button');

        creatBtn.id = "qr";
        creatBtn.innerHTML = "QR-Code herunterladen";
        //creatBtn.onclick = creatDevice.bind(null);

        bar.appendChild(creatBtn);
    }

    function addLogs() {

        let creatBtn = document.createElement('button');

        creatBtn.id = "logs";
        creatBtn.innerHTML = "Logs anzeigen";
        //creatBtn.onclick = creatDevice.bind(null);

        bar.appendChild(creatBtn);
    }

    function addDelete() {

        let deleteBtn = document.createElement('button');

        deleteBtn.id = "delete";
        deleteBtn.innerHTML = "Gerät löschen";
        deleteBtn.onclick = deleteDevice.bind(null);

        bar.appendChild(deleteBtn);
    }

    function addUpdate() {

        let updateBtn = document.createElement('button');

        updateBtn.id = "update";
        updateBtn.innerHTML = "Gerät aktualisieren";
        updateBtn.onclick = updateDevice.bind(null);

        bar.appendChild(updateBtn);
    }

    function getData(entryID){

        var param = {
            id : (entryID)
        }

        async function fetchData(param) {

            try {
                const response = await fetch('http://127.0.0.1:5000/get_device', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ param })
                });

                const data = await response.json();

                if (data[0] != null) {

                    document.getElementById('typ').value = data[0][1];
                    document.getElementById('name').value = data[0][2];
                    document.getElementById('device_type').value = data[0][3];
                    document.getElementById('serial_number').value = data[0][4];
                    document.getElementById('condition').value = data[0][5];
                    document.getElementById('warranty').value = data[0][6];
                    document.getElementById('purchase').value = data[0][7];
                    document.getElementById('manufacturer').value = data[0][8];
                    document.getElementById('product_url').value = data[0][9];
                    document.getElementById('image_url').value = data[0][10];
                    document.getElementById('comment').value = data[0][11];

                } else {
                    window.location.href = "http://127.0.0.1:5000/not_found"
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);
    };

    var loginkey = sessionStorage.getItem("loginKey");
    var currentUrl = window.location.href;

    if (loginkey != null) {

        var param = {
            key : (loginkey)
        }

        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/check_key', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();

                if (data == true && currentUrl.includes('http://127.0.0.1:5000/creat_device')){

                    addCreat()

                }else if (data == false && currentUrl.includes('http://127.0.0.1:5000/creat_device')) {

                    window.location.href = "http://127.0.0.1:5000/denied"

                }else if (data == true && currentUrl.includes('http://127.0.0.1:5000/device')){

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    editAll()

                    addUpdate()
                    addDelete()

                }else if (data == false && currentUrl.includes('http://127.0.0.1:5000/device')) {

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    readAll()
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else if (currentUrl.includes('http://127.0.0.1:5000/creat_device')){
        window.location.href = "http://127.0.0.1:5000/denied"

    }else if (currentUrl.includes('http://127.0.0.1:5000/device')){

        var entryID = currentUrl.split('/').pop();

        readAll()
        getData(entryID)
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function toHome(){
    window.location.href = "http://127.0.0.1:5000/"
}

document.getElementById('image_url').addEventListener('change', function() {
    document.getElementById('img').src = document.getElementById('image_url').value;
});

function creatDevice(){

    var param = {

        typ : (document.getElementById('typ').value),
        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        serial_number : (document.getElementById('serial_number').value),
        condition : (document.getElementById('condition').value),
        warranty : (document.getElementById('warranty').value),
        purchase : (document.getElementById('purchase').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        image_url : (document.getElementById('image_url').value),
        comment : (document.getElementById('comment').value),

    }

    if (param.name != "" && param.serial_number != ""){

        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/add_device', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();

                if (data[0] == true) {

                    document.getElementById("infoBox").style.backgroundColor = "#a5e1cd"
                    document.getElementById("infoText").innerHTML = "Typ erstellt"

                    document.getElementById("infoBox").style.display = "block"
                    document.getElementById("infoText").style.display = "block"

                    await delay(1000);
                    window.location.href = "http://127.0.0.1:5000/device/"+data[1]+""

                }else if (data[0] == false){

                    document.getElementById("infoBox").style.backgroundColor = "#ff7d7d"
                    document.getElementById("infoText").innerHTML = "Type mit diesem namen exestiert bereits"

                    document.getElementById("infoBox").style.display = "block"
                    document.getElementById("infoText").style.display = "block"

                }else {

                    document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                    document.getElementById("infoText").innerHTML = "Es ist ein fehler aufgetreten"

                    document.getElementById("infoBox").style.display = "block"
                    document.getElementById("infoText").style.display = "block"
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else{

        document.getElementById("infoBox").style.backgroundColor = "#ff7d7d"
        document.getElementById("infoText").innerHTML = "Name und Geräteart muss angegeben werden"

        document.getElementById("infoBox").style.display = "block"
        document.getElementById("infoText").style.display = "block"
    }
}

function deleteDevice(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {
        id : (entryID)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/delete_device', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data == true){

                document.getElementById("infoBox").style.backgroundColor = "#a5e1cd"
                document.getElementById("infoText").innerHTML = "Geräte wurde gelöscht"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"

                await delay(1000);
                toHome()

            } else {

                document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                document.getElementById("infoText").innerHTML = "Es ist ein fehler aufgetreten"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
}

function updateDevice(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {

        id : (entryID),
        typ : (document.getElementById('typ').value),
        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        serial_number : (document.getElementById('serial_number').value),
        condition : (document.getElementById('condition').value),
        warranty : (document.getElementById('warranty').value),
        purchase : (document.getElementById('purchase').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        image_url : (document.getElementById('image_url').value),
        comment : (document.getElementById('comment').value),
        
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/update_device', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data == true){

                document.getElementById("infoBox").style.backgroundColor = "#a5e1cd"
                document.getElementById("infoText").innerHTML = "Geräte wurde aktualisiert"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"

                await delay(1000);
                window.location.reload();

            } else {

                document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                document.getElementById("infoText").innerHTML = "Es ist ein fehler aufgetreten"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
}