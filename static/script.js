window.onload = function() {
    displayAllEntrys()
}

function displayEntry(search){

    let container = document.getElementById('container');
    container.textContent = '';

    if (search === ""){

        displayAllEntrys();
    } else {

        var param = {
            text : (search)
        }

        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/get', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();
                console.log(data[0])

                generateHtmlTags(data[0])

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);
    }
}

function displayAllEntrys(){

    let container = document.getElementById('container');
    container.textContent = '';

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_all', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( null )
            });

            const data = await response.json();
            console.log(data)

            data.forEach(element => {
                generateHtmlTags(element)
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchData();
}

function generateHtmlTags(item) {

    let div = document.createElement('div');
    let deleteButton = document.createElement('button');
    let editButton = document.createElement('button');
    let input = document.createElement('input');

    div.style = "display: flex;";

    deleteButton.id = "delete-button-"+item[0];
    deleteButton.innerHTML = "delete";
    deleteButton.onclick = remove.bind(null, item[0]);

    editButton.id = "edit-button-"+item[0];
    editButton.innerHTML = "edit";
    editButton.onclick = edit.bind(null, item[0]);

    input.id = "input-"+item[0];
    input.value = item[1];
    input.readOnly = true;
    input.addEventListener('change', save.bind(null, item[0]))

    div.appendChild(deleteButton);
    div.appendChild(editButton);
    div.appendChild(input);

    container.appendChild(div);
}

function edit(id){

    let input = document.getElementById('input-'+id);
    input.readOnly = false;
};

function save(id){

    var input = document.getElementById("input-"+id);

    var param = {
        id : (id),
        text: (input.value)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/update', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            displayAllEntrys();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
};

function remove(id){

    var param = {
        id : (id)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/remove', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            displayAllEntrys();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
};

function add(){

    var context = document.getElementById("context");

    var param = {
        text : (context.value)
    }

    async function fetchData(param) {

        try {
            const response = await fetch('http://127.0.0.1:5000/get', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ param })
            });

            const data = await response.json();
            console.log(data)

            if (context.value != "") {

                var param = {
                    text : context.value,
                }

                fetch('http://127.0.0.1:5000/add', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ param })
                })

                .then(response => response.json())
                .then(data => console.log(data.result))
                .catch(error => console.error('Error:', error));

                 displayAllEntrys();

            } else {

                if (context.value == "") {
                    window.alert("context nicht gültig!")
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
};