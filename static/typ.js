window.onload = function() {

    let bar = document.getElementById('bar');

    function editAll() {

        document.getElementById('name').readOnly = false;
        document.getElementById('device_type').readOnly = false;
        document.getElementById('warranty').readOnly = false;
        document.getElementById('manufacturer').readOnly = false;
        document.getElementById('product_url').readOnly = false;
        document.getElementById('image_url').readOnly = false;
        document.getElementById('comment').readOnly = false;
    }

    function readAll() {

        document.getElementById('name').readOnly = true;
        document.getElementById('device_type').readOnly = true;
        document.getElementById('warranty').readOnly = true;
        document.getElementById('manufacturer').readOnly = true;
        document.getElementById('product_url').readOnly = true;
        document.getElementById('image_url').readOnly = true;
        document.getElementById('comment').readOnly = true;
    }

    function addCreat() {

        let creatBtn = document.createElement('button');

        creatBtn.id = "creat";
        creatBtn.innerHTML = "Typ anlegen";
        creatBtn.onclick = creatType.bind(null);

        bar.appendChild(creatBtn);
    }

    function addDelete() {

        let deleteBtn = document.createElement('button');

        deleteBtn.id = "delete";
        deleteBtn.innerHTML = "Typ löschen";
        deleteBtn.onclick = deleteType.bind(null);

        bar.appendChild(deleteBtn);
    }

    function addUpdate() {

        let updateBtn = document.createElement('button');

        updateBtn.id = "update";
        updateBtn.innerHTML = "Typ aktualisieren";
        updateBtn.onclick = updateType.bind(null);

        bar.appendChild(updateBtn);
    }

    function getData(entryID){

        var param = {
            id : (entryID)
        }

        async function fetchData(param) {

            try {
                const response = await fetch('http://127.0.0.1:5000/get_type', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ param })
                });

                const data = await response.json();
                console.log(data)

                if (data[0] != null) {

                    document.getElementById('name').value = data[0][1];
                    document.getElementById('device_type').value = data[0][2];
                    document.getElementById('warranty').value = data[0][4];
                    document.getElementById('manufacturer').value = data[0][5];
                    document.getElementById('product_url').value = data[0][6];
                    document.getElementById('image_url').value = data[0][7];
                    document.getElementById('comment').value = data[0][8];

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

                if (data == true && currentUrl.includes('http://127.0.0.1:5000/creat_type')){

                    addCreat()

                }else if (data == false && currentUrl.includes('http://127.0.0.1:5000/creat_type')) {

                    window.location.href = "http://127.0.0.1:5000/denied"

                }else if (data == true && currentUrl.includes('http://127.0.0.1:5000/type')){

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    editAll()

                    addUpdate()
                    addDelete()

                }else if (data == false && currentUrl.includes('http://127.0.0.1:5000/type')) {

                    var entryID = currentUrl.split('/').pop();

                    getData(entryID)
                    readAll()
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);

    }else if (currentUrl.includes('http://127.0.0.1:5000/creat_type')){
        window.location.href = "http://127.0.0.1:5000/denied"

    }else if (currentUrl.includes('http://127.0.0.1:5000/type')){
        
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function toHome(){
    window.location.href = "http://127.0.0.1:5000/"
}

document.getElementById('image_url').addEventListener('change', function() {
    document.getElementById('img').src = document.getElementById('image_url').value;
});

function creatType(){

    var param = {

        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        warranty : (document.getElementById('warranty').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        image_url : (document.getElementById('image_url').value),
        comment : (document.getElementById('comment').value),
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/add_type', {

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

    fetchData(param);
}

function deleteType(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {
        id : (entryID)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/delete_type', {

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

    fetchData(param);
}

function updateType(){

    var currentUrl = window.location.href;
    var entryID = currentUrl.split('/').pop();

    var param = {

        id : (entryID),
        name : (document.getElementById('name').value),
        device_type : (document.getElementById('device_type').value),
        warranty : (document.getElementById('warranty').value),
        manufacturer : (document.getElementById('manufacturer').value),
        product_url : (document.getElementById('product_url').value),
        image_url : (document.getElementById('image_url').value),
        comment : (document.getElementById('comment').value),
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/update_type', {

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

    fetchData(param);
}