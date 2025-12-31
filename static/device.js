window.onload = function() {

    let bar = document.getElementById('bar');

    // edit mode only when loged in as Admin

    function editAll() {

        document.getElementById('typ').readOnly = false;
        document.getElementById('name').readOnly = false;
        document.getElementById('device_type').readOnly = false;
        document.getElementById('serial_number').readOnly = false;
        document.getElementById('condition').readOnly = false;
        document.getElementById('location').readOnly = false;
        document.getElementById('warranty').readOnly = false;
        document.getElementById('purchase').readOnly = false;
        document.getElementById('manufacturer').readOnly = false;
        document.getElementById('product_url').readOnly = false;
        document.getElementById('image_file').type = "file";
        document.getElementById('comment').readOnly = false;
    }

    // read mode when not loged in

    function readAll() {

        document.getElementById('typ').readOnly = true;
        document.getElementById('name').readOnly = true;
        document.getElementById('device_type').readOnly = true;
        document.getElementById('serial_number').readOnly = true;
        document.getElementById('condition').readOnly = true;
        document.getElementById('location').readOnly = true;
        document.getElementById('warranty').readOnly = true;
        document.getElementById('purchase').readOnly = true;
        document.getElementById('manufacturer').readOnly = true;
        document.getElementById('product_url').readOnly = true;
        document.getElementById('image_file').type = "text";
        document.getElementById('comment').readOnly = true;
    }

    // this adds the creat button to the bar

    function addCreat() {

        let creatBtn = document.createElement('button');
        let creatSpan = document.createElement('span');
        let creatP = document.createElement('p');

        creatBtn.id = "creat";
        creatBtn.onclick = creatDevice.bind(null);
        creatBtn.classList = "normal-btn";
        creatBtn.style = "font-size: 20px; border-color: #A5E1CD; display: flex;"

        creatSpan.classList = "material-icons";
        creatSpan.innerHTML = "add";
        creatSpan.style = "margin-left: 10px; margin-top: 2px; color: #A5E1CD;";
        
        creatP.innerHTML = "Gerät anlegen";
        creatP.style = "margin: auto";

        creatBtn.appendChild(creatSpan);
        creatBtn.appendChild(creatP);
        bar.appendChild(creatBtn);

        document.getElementById("barBox").style.display = "block";
    }

    // this adds the QR button to the bar

    function addQR() {

        let qrBtn = document.createElement('button');
        let qrSpan = document.createElement('span');
        let qrP = document.createElement('p');

        qrBtn.id = "delete";
        qrBtn.onclick = generateQR.bind(null);
        qrBtn.classList = "normal-btn";
        qrBtn.style = "font-size: 20px; border-color: #A5E1CD; display: flex;"

        qrSpan.classList = "material-icons";
        qrSpan.innerHTML = "qr_code";
        qrSpan.style = "margin-left: 10px; margin-top: 2px; color: #A5E1CD;";
        
        qrP.innerHTML = "QR-Code herunterladen";
        qrP.style = "margin: auto";

        qrBtn.appendChild(qrSpan);
        qrBtn.appendChild(qrP);
        bar.appendChild(qrBtn);

        document.getElementById("barBox").style.display = "block";
    }

    // this adds the Log button to the bar

    function addLogs() {

        let logBtn = document.createElement('button');
        let logSpan = document.createElement('span');
        let logP = document.createElement('p');

        logBtn.id = "logs";
        logBtn.onclick = toLog.bind(null);
        logBtn.classList = "normal-btn";
        logBtn.style = "font-size: 20px; border-color: #FFD579; display: flex;"

        logSpan.classList = "material-icons";
        logSpan.innerHTML = "description";
        logSpan.style = "margin-left: 10px; margin-top: 2px; color: #FFD579;";
        
        logP.innerHTML = "Logs anzeigen";
        logP.style = "margin: auto";

        logBtn.appendChild(logSpan);
        logBtn.appendChild(logP);
        bar.appendChild(logBtn);

        document.getElementById("barBox").style.display = "block";
    }

    // this adds the delete button to the bar

    function addDelete() {

        let deleteBtn = document.createElement('button');
        let deleteSpan = document.createElement('span');
        let deleteP = document.createElement('p');

        deleteBtn.id = "delete";
        deleteBtn.onclick = deleteDevice.bind(null);
        deleteBtn.classList = "normal-btn";
        deleteBtn.style = "font-size: 20px; border-color: #FF7D7D; display: flex;"

        deleteSpan.classList = "material-icons";
        deleteSpan.innerHTML = "delete";
        deleteSpan.style = "margin-left: 10px; margin-top: 2px; color: #FF7D7D;";
        
        deleteP.innerHTML = "Gerät löschen";
        deleteP.style = "margin: auto";

        deleteBtn.appendChild(deleteSpan);
        deleteBtn.appendChild(deleteP);
        bar.appendChild(deleteBtn);

        document.getElementById("barBox").style.display = "block";
    }

    // this adds the update button to the bar

    function addUpdate() {

        let updateBtn = document.createElement('button');
        let updateSpan = document.createElement('span');
        let updateP = document.createElement('p');

        updateBtn.id = "update";
        updateBtn.onclick = updateDevice.bind(null);
        updateBtn.classList = "normal-btn";
        updateBtn.style = "font-size: 20px; border-color: #CFC4FF; display: flex;";
        
        updateSpan.classList = "material-icons";
        updateSpan.innerHTML = "save";
        updateSpan.style = "margin-left: 10px; margin-top: 2px; color: #CFC4FF;";
        
        updateP.innerHTML = "Gerät aktualisieren";
        updateP.style = "margin: auto";

        updateBtn.appendChild(updateSpan);
        updateBtn.appendChild(updateP);
        bar.appendChild(updateBtn);

        document.getElementById("barBox").style.display = "block";
    }

    // this gets/fills out the data for all inputs on the page when the page loads

    function getData(entryID){

        var param = {
            id : (entryID)
        }

        async function fetchData(param) {

            try {
                const response = await fetch('/get_device', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ param })
                });

                const data = await response.json();

                console.log(data);

                if (data[0] != null) {

                    document.getElementById('typ').value = data[0][1];
                    document.getElementById('name').value = data[0][2];
                    document.getElementById('device_type').value = data[0][3];
                    document.getElementById('serial_number').value = data[0][4];
                    document.getElementById('condition').value = data[0][5];
                    document.getElementById('location').value = data[0][6];
                    document.getElementById('warranty').value = data[0][7];
                    document.getElementById('purchase').value = data[0][8];
                    document.getElementById('manufacturer').value = data[0][9];
                    document.getElementById('product_url').value = data[0][10];
                    document.getElementById('comment').value = data[0][12];

                    if (data[0][11] != "") {

                        document.getElementById('img').src = "/get_img/"+data[0][11]+"";
                        document.getElementById("img_display").style = "display: block;";

                        async function fetchData() {
                            const img_response = await fetch('/get_img_name/' + data[0][11]);
                            const img_data = await img_response.json();
                            if (String(img_data[0][0]).length >= 15) {
                                document.getElementById('img_name').innerHTML = String(img_data[0][0]).substring(0, 14) + '...';    
                            }else{
                                document.getElementById('img_name').innerHTML = String(img_data[0][0]);
                            }
                        }
                        fetchData()
                    }

                } else {
                    window.location.href = "/not_found"
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);
    };

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

                if (data == true && currentUrl.includes('/creat_device')){

                    // creat new device and loged in as Admin 

                    document.getElementById("img_display").style = "display: none;";
                    document.getElementById("user").innerHTML = "Admin";

                    addCreat()
                    loadImgStateCreate()

                }else if (data == false && currentUrl.includes('/creat_device')) {

                    // creat new device and not loged in

                    window.location.href = "/denied"

                }else if (data == true && currentUrl.includes('/device')){

                    // view device and loged in as Admin

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    editAll()

                    addUpdate()
                    addDelete()
                    addLogs()
                    addQR()

                    document.getElementById("user").innerHTML = "Admin";

                }else if (data == false && currentUrl.includes('/device')) {

                    // view device and not loged in

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    readAll()
                    addQR()

                    document.getElementById("user").innerHTML = "Beobachter";
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else if (currentUrl.includes('/creat_device')){

        // creat new device and not loged in

        window.location.href = "/denied"

    }else if (currentUrl.includes('/device')){

        // view device and not loged in

        var entryID = currentUrl.split('/').pop();

        readAll()
        getData(entryID)
        addQR()

        document.getElementById("user").innerHTML = "Beobachter";
    }

    // this fills out the type list with all curent existing types

    async function fetchData() {
        try {
            const response = await fetch('/get_all_types', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            var options = ''

            for (var i = 0; i < data.length; i++) {
                options += '<option value="' + data[i][1] + '" />';
            }

            document.getElementById('list').innerHTML = options;

        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchData()
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// back to home

function toHome(){
    window.location.href = "/"
}

// opens a new tap with all logs of this device

function toLog(){
    
    var newWindow = window.open('/log');
    newWindow.device = ""+document.getElementById('serial_number').value+"";
}

// load img on page load in device creation state and img changed

function loadImgStateCreate(){

    const input = document.getElementById('image_file');

    if (input.value != "") {
        const file = input.files[0];

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {

            document.getElementById('img').src = e.target.result;
            document.getElementById("img_display").style = "display: block;";

            if (String(file.name).length >= 15) {
                document.getElementById('img_name').innerHTML = String(file.name).substring(0, 14) + '...';    
            }else{
                document.getElementById('img_name').innerHTML = String(file.name);
            }
        }
        reader.readAsDataURL(file);
    
    } else {

        var param = {
            name : (document.getElementById('typ').value),
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
                console.log(data);

                if (data.length > 0 && data[0][6] != "") {

                    document.getElementById('img').src = "/get_img/"+data[0][6]+"";
                    document.getElementById("img_display").style = "display: block;";

                    async function fetchData() {
                        const img_response = await fetch('/get_img_name/' + data[0][6]);
                        const img_data = await img_response.json();
                        if (String(img_data[0][0]).length >= 15) {
                            document.getElementById('img_name').innerHTML = String(img_data[0][0]).substring(0, 14) + '...';    
                        }else{
                            document.getElementById('img_name').innerHTML = String(img_data[0][0]);
                        }
                    }
                    fetchData()
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData()
    }
}

// trigers when img is changed

document.getElementById('image_file').addEventListener('change', function() {
    loadImgStateCreate()
});

// lets you download the uploaded img

function downloadImg(){

    const link = document.createElement('a');
    link.href = document.getElementById('img').src;
    link.download = 'img.jpg';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

// QR-Code für ein spezifisches Gerät generieren und anzeigen

function generateQR() {

    var param = {
        url : (window.location.href),
    }
    
    async function fetchData() {
        try {
            const response = await fetch('/generate_qr', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.blob();
            const url = URL.createObjectURL(data);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = 'qr_code.png';
            document.body.appendChild(downloadLink);
            
            downloadLink.click();
            document.body.removeChild(downloadLink);

            } catch (error) {

                // on fail
                console.error('Error:', error);
                showInfoBox("warning", "Es ist ein fehler aufgetreten")
            }
        }

    fetchData(param);
}

// this checks if the device is in warranty or out of warranty

document.getElementById('purchase').addEventListener('change', function() {
    
    var warranty = document.getElementById('warranty').value;
    var purchase = document.getElementById('purchase').value;
    purchase = new Date(new Date(purchase))
    var currentMonth = purchase.getMonth();
    var monthToAdd = currentMonth + Number(warranty)
    purchaseWithWarranty = purchase.setMonth(monthToAdd); 

    if (Date.now() < purchaseWithWarranty){

        purchaseWithWarranty = new Date(purchaseWithWarranty);

        document.getElementById("warranty_end_box").style.borderColor = "#a5e1cd"
        document.getElementById("warranty_end").innerHTML = "Die Garantie läuft am "+purchaseWithWarranty.toLocaleDateString()+" aus"
        document.getElementById("warranty_end_box").style.display = "block"

    } else {

        purchaseWithWarranty = new Date(purchaseWithWarranty);

        document.getElementById("warranty_end_box").style.borderColor = "#ff7d7d"
        document.getElementById("warranty_end").innerHTML = "Die Garantie ist am "+purchaseWithWarranty.toLocaleDateString()+" abgelaufen"
        document.getElementById("warranty_end_box").style.display = "block"
    }
});

// this is to fill out the fields when a currently existing type is selected

document.getElementById('typ').addEventListener('change', function() {

    var param = {
        name : (document.getElementById('typ').value),
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
            console.log(data);

            if (data[0] != null) {

                document.getElementById('name').value = data[0][1];
                document.getElementById('device_type').value = data[0][2];
                document.getElementById('warranty').value = data[0][3];
                document.getElementById('manufacturer').value = data[0][4];
                document.getElementById('product_url').value = data[0][5];

                if (data[0][6] != "") {

                    document.getElementById('img').src = "/get_img/"+data[0][6]+"";
                    document.getElementById("img_display").style = "display: block;";

                    async function fetchData() {
                        const img_response = await fetch('/get_img_name/' + data[0][6]);
                        const img_data = await img_response.json();
                        if (String(img_data[0][0]).length >= 15) {
                            document.getElementById('img_name').innerHTML = String(img_data[0][0]).substring(0, 14) + '...';    
                        }else{
                            document.getElementById('img_name').innerHTML = String(img_data[0][0]);
                        }
                    }
                    fetchData()
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchData()

});

// for showing success, warning and error notification

function showInfoBox(typ, text){

    if (typ == "success") {
        document.getElementById("infoBox").style.borderColor = "#a5e1cd";
    } else if (typ == "warning"){
        document.getElementById("infoBox").style.borderColor = "#ffd579";
    } else if (typ == "error"){
        document.getElementById("infoBox").style.borderColor = "#ff7d7d";
    }

    document.getElementById("infoText").innerHTML = text;
    document.getElementById("infoBox").style.display = "block";
    document.getElementById("infoText").style.display = "block";

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// this is for creating a new device

function creatDevice(){

    var param = {

        key : (sessionStorage.getItem("loginKey")),
        typ : (document.getElementById('typ').value),
        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        serial_number : (document.getElementById('serial_number').value),
        condition : (document.getElementById('condition').value),
        location : (document.getElementById('location').value),
        warranty : (document.getElementById('warranty').value),
        purchase : (document.getElementById('purchase').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        comment : (document.getElementById('comment').value),
    }

    if (param.name != "" && param.serial_number != ""){

        async function fetchData() {
            try {
                const response = await fetch('/add_device', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();

                if (data[0] == true && data[1] == "success") {

                    // on success
                    uploadImg(data[2], "device")
                    showInfoBox("success", "Gerät erfolgreich erstellt")
                    await delay(1000);
                    window.location.href = "/device/"+data[2]+""

                }else if (data[0] == false && data[1] == "exists"){

                    // device already exists
                    showInfoBox("error", "Gerät mit dieser Seriennummer exestiert bereits")

                }else if (data[0] == false && data[1] == "denied"){

                    // not enough rights 
                    showInfoBox("warning", "Nicht genügend Berechtigungen")

                }

            } catch (error) {

                // on fail

                console.error('Error:', error);
                showInfoBox("warning", "Es ist ein fehler aufgetreten")
            }
        }

        fetchData(param);

    }else{

        // form was not filed out correct 
        showInfoBox("error", "Name und Seriennummer muss angegeben werden")
    }
}

// this is for deleting an existing device

function deleteDevice(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {
        
        key : (sessionStorage.getItem("loginKey")),
        id : (entryID)
    }

    async function fetchData() {
        try {
            const response = await fetch('/delete_device', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data[0] == true && data[1] == "success"){

                // on success
                showInfoBox("success", "Geräte wurde gelöscht")
                await delay(1000);
                toHome()

            }else if (data[0] == false && data[1] == "denied"){

                // not enough rights 
                showInfoBox("warning", "Nicht genügend Berechtigungen")
            }

        } catch (error) {

            // on fail
            console.error('Error:', error);
            showInfoBox("warning", "Es ist ein fehler aufgetreten")
        }
    }

    fetchData(param);
}

// this is for updating an existing device

function updateDevice(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {

        key : (sessionStorage.getItem("loginKey")),
        id : (entryID),
        typ : (document.getElementById('typ').value),
        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        serial_number : (document.getElementById('serial_number').value),
        condition : (document.getElementById('condition').value),
        location : (document.getElementById('location').value),
        warranty : (document.getElementById('warranty').value),
        purchase : (document.getElementById('purchase').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        comment : (document.getElementById('comment').value),
    }

    async function fetchData() {
        try {
            const response = await fetch('/update_device', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();

            if (data[0] == true && data[1] == "success"){

                // on success
                uploadImg(param.id, "device")
                showInfoBox("success", "Gerät wurde aktualisiert")
                await delay(1000);
                window.location.reload();

            }else if (data[0] == false && data[1] == "exists"){

                // device exists alredy 
                showInfoBox("error", "Gerät mit dieser Seriennummer exestiert bereits")

            }else if (data[0] == false && data[1] == "denied"){

                // not enough rights 
                showInfoBox("warning", "Nicht genügend Berechtigungen")
            } 

        } catch (error) {

            // on fail
            console.error('Error:', error);
            showInfoBox("warning", "Es ist ein fehler aufgetreten")
        }
    }

    fetchData(param);
}

// this is for uploading imgs

async function uploadImg(id, table) {

    const input = document.getElementById('image_file');
    const file = input.files[0];

    if (!file) {

        console.log(id)

        var param = {
            name : (document.getElementById('typ').value),
            id : id[0][0]
        }
    
        async function fetchData() {
            try {
                const response = await fetch('/add_img_by_typ', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData()

    }else{

        // Create a canvas to resize the image
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500; // Resize to max 500px width
                const scaleSize = MAX_WIDTH / img.width;
                const originalName = file.name;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Convert canvas to a compressed JPEG (0.7 quality)
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, originalName);
                    formData.append('id', id);
                    formData.append('table', table);

                    const response = await fetch('/upload', { method: 'POST', body: formData});
                    const result = await response.json();
                }, 'image/jpeg', 0.7); 
            };
        };

        reader.readAsDataURL(file);
        
    }
}