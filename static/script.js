window.onload = function() {

    var loginkey = sessionStorage.getItem("loginKey");

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
                console.log(data)

                if (data == true) {

                    document.getElementById("user").innerHTML = "Admin";
                    document.getElementById("logoutOption").style.display = "block";
                    document.getElementById("changePwOption").style.display = "block";

                }else if (data == false){

                    document.getElementById("user").innerHTML = "Beobachter";
                    document.getElementById("loginOption").style.display = "block";
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);
    }else {
        
        document.getElementById("user").innerHTML = "Beobachter";
        document.getElementById("loginOption").style.display = "block";

    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function toSearch(){
    window.location.href = "http://127.0.0.1:5000/search";
}

function toDevice(){
    window.location.href = "http://127.0.0.1:5000/device"
}

function toType(){
    window.location.href = "http://127.0.0.1:5000/type"
}

function toHome(){
    window.location.href = "http://127.0.0.1:5000/"
}

// ---------- Login Popup ----------

function toLogin() {

    document.querySelector(".loginPopup").style.display = "block";
    document.querySelector(".loginOverlay").style.display = "block";

    document.getElementById("infoBox").style.display = "none";
    document.getElementById("infoText").style.display = "none";

    document.getElementById("loginInput").value = "";
}

function closeToLogin() {

    document.querySelector(".loginPopup").style.display = "none";
    document.querySelector(".loginOverlay").style.display = "none";
}

// ---------- Change Password Popup ----------

function toChangePW() {

    document.querySelector(".changePWPopup").style.display = "block";
    document.querySelector(".changePWOverlay").style.display = "block";

    document.getElementById("infoBox").style.display = "none";
    document.getElementById("infoText").style.display = "none";

    document.getElementById("loginInput").value = "";
}

function closeToChangePW() {

    document.querySelector(".changePWPopup").style.display = "none";
    document.querySelector(".changePWOverlay").style.display = "none";
}

// ---------- Function Login ----------

function login(){

    let loginInput = document.getElementById('loginInput');

    var param = {
        password : (loginInput.value)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/check_password', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();
            console.log(data[0])

            if (data[0] == true) {

                document.getElementById("infoBox").style.backgroundColor = "#a5e1cd"
                document.getElementById("infoText").innerHTML = "Anmeldung erfolgreich"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"

                sessionStorage.setItem("loginKey", data[1]);
                await delay(1000);
                toHome();

            } else if (data[0] == false) {

                document.getElementById("infoBox").style.backgroundColor = "#ff7d7d"
                document.getElementById("infoText").innerHTML = "Password inkorrekt"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"

            }else {

                document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                document.getElementById("infoText").innerHTML = "Anmeldung fehlgeschlagen"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
}

// ---------- Function Change Password ----------

function changePw(){

    let currentPasswort = document.getElementById('currentPasswort');

    var param = {
        password : (currentPasswort.value)
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/check_password', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();
            console.log(data[0])

            if (data[0] == true) {

                let newPasswort = document.getElementById('newPasswort');
                let repeatPasswort = document.getElementById('repeatPasswort');

                if (newPasswort == repeatPasswort){
                    
                    var param = {
                        password : (loginInput.value)
                    }

                    async function fetchData() {
                        try {
                            const response = await fetch('http://127.0.0.1:5000/check_password', {

                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({param})
                            });

                            const data = await response.json();
                            console.log(data[0])

                            if (data[0] == true) {

                                document.getElementById("infoBox").style.backgroundColor = "#a5e1cd"
                                document.getElementById("infoText").innerHTML = "Anmeldung erfolgreich"

                                document.getElementById("infoBox").style.display = "block"
                                document.getElementById("infoText").style.display = "block"

                                sessionStorage.setItem("loginKey", data[1]);
                                await delay(1000);
                                toHome();

                            } else if (data[0] == false) {

                                document.getElementById("infoBox").style.backgroundColor = "#ff7d7d"
                                document.getElementById("infoText").innerHTML = "Password inkorrekt"

                                document.getElementById("infoBox").style.display = "block"
                                document.getElementById("infoText").style.display = "block"

                            }else {

                                document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                                document.getElementById("infoText").innerHTML = "Anmeldung fehlgeschlagen"

                                document.getElementById("infoBox").style.display = "block"
                                document.getElementById("infoText").style.display = "block"
                            }

                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }

                    fetchData(param);
                }

            } else if (data[0] == false) {

                document.getElementById("infoBox").style.backgroundColor = "#ff7d7d"
                document.getElementById("infoText").innerHTML = "Password inkorrekt"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"

            }else {

                document.getElementById("infoBox").style.backgroundColor = "#ffd579"
                document.getElementById("infoText").innerHTML = "fehlgeschlagen"

                document.getElementById("infoBox").style.display = "block"
                document.getElementById("infoText").style.display = "block"
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
}

// ---------- Logout ----------

function logout(){

    var param = {
        key : (sessionStorage.getItem("loginKey"))
    }

    async function fetchData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/logout', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            sessionStorage.removeItem("loginKey") 
            toHome();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchData(param);
}
