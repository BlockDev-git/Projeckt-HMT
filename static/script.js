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

    document.getElementById("infoBoxLogin").style.display = "none";
    document.getElementById("infoTextLogin").style.display = "none";

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

    document.getElementById("infoBoxChangePW").style.display = "none";
    document.getElementById("infoTextChangePW").style.display = "none";

    document.getElementById("currentPasswort").value = "";
    document.getElementById("repeatPasswort").value = "";
    document.getElementById("newPasswort").value = "";
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

                document.getElementById("infoBoxLogin").style.backgroundColor = "#a5e1cd"
                document.getElementById("infoTextLogin").innerHTML = "Anmeldung erfolgreich"

                document.getElementById("infoBoxLogin").style.display = "block"
                document.getElementById("infoTextLogin").style.display = "block"

                sessionStorage.setItem("loginKey", data[1]);
                await delay(1000);
                toHome();

            } else if (data[0] == false) {

                document.getElementById("infoBoxLogin").style.backgroundColor = "#ff7d7d"
                document.getElementById("infoTextLogin").innerHTML = "Password inkorrekt"

                document.getElementById("infoBoxLogin").style.display = "block"
                document.getElementById("infoTextLogin").style.display = "block"

            }else {

                document.getElementById("infoBoxLogin").style.backgroundColor = "#ffd579"
                document.getElementById("infoTextLogin").innerHTML = "Anmeldung fehlgeschlagen"

                document.getElementById("infoBoxLogin").style.display = "block"
                document.getElementById("infoTextLogin").style.display = "block"
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

                if (newPasswort.value == repeatPasswort.value && newPasswort.value != "" && repeatPasswort.value != ""){

                    var newParam = {
                        password : (newPasswort.value)
                    }

                    async function fetchNewData() {
                        try {
                            const response = await fetch('http://127.0.0.1:5000/update_password', {

                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({newParam})
                            });

                            const data = await response.json();

                            if (data == true) {

                                document.getElementById("infoBoxChangePW").style.backgroundColor = "#a5e1cd"
                                document.getElementById("infoTextChangePW").innerHTML = "Passwort änderung erfolgreich"

                                document.getElementById("infoBoxChangePW").style.display = "block"
                                document.getElementById("infoTextChangePW").style.display = "block"

                                await delay(1000);
                                toHome();

                            }else {

                                document.getElementById("infoBoxChangePW").style.backgroundColor = "#ffd579"
                                document.getElementById("infoTextChangePW").innerHTML = "Passwort änderung fehlgeschlagen"

                                document.getElementById("infoBoxChangePW").style.display = "block"
                                document.getElementById("infoTextChangePW").style.display = "block"
                            }

                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }

                    fetchNewData(newParam);
                }else if (newPasswort.value != repeatPasswort.value){

                    document.getElementById("infoBoxChangePW").style.backgroundColor = "#ffd579"
                    document.getElementById("infoTextChangePW").innerHTML = "Wiederholtes Password nicht ident mit neuem Passwort"

                    document.getElementById("infoBoxChangePW").style.display = "block"
                    document.getElementById("infoTextChangePW").style.display = "block"

                }else if (newPasswort.value == "" && repeatPasswort.value == ""){

                    document.getElementById("infoBoxChangePW").style.backgroundColor = "#ffd579"
                    document.getElementById("infoTextChangePW").innerHTML = "Neues Passwort ist nicht erlaubt"

                    document.getElementById("infoBoxChangePW").style.display = "block"
                    document.getElementById("infoTextChangePW").style.display = "block"
                }

            } else if (data[0] == false) {

                document.getElementById("infoBoxChangePW").style.backgroundColor = "#ff7d7d"
                document.getElementById("infoTextChangePW").innerHTML = "Password inkorrekt"

                document.getElementById("infoBoxChangePW").style.display = "block"
                document.getElementById("infoTextChangePW").style.display = "block"

            }else {

                document.getElementById("infoBoxChangePW").style.backgroundColor = "#ffd579"
                document.getElementById("infoTextChangePW").innerHTML = "fehlgeschlagen"

                document.getElementById("infoBoxChangePW").style.display = "block"
                document.getElementById("infoTextChangePW").style.display = "block"
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
