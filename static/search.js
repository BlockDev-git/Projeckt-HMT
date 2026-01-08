window.onload = function() {
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function toHome(){
    window.location.href = "/"
}

function search(){

    var param = {

        name : (document.getElementById('name').value),
        serial_number : (document.getElementById('serial_number').value),
        typ : (document.getElementById('typ').value),
        condition : (document.getElementById('condition').value),
    }

    async function fetchData() {
            try {
                const response = await fetch('/search_device', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({param})
                });

                const data = await response.json();
                console.log(data)

                if (data[0] == true) {

                    console.log(data)

                }else {
                    //fehler
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

    fetchData(param);
}