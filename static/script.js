window.onload = function() {

    window.addEventListener('resize', handleResize);
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
                console.log(data)

                if (data == true) {

                    document.getElementById("user").innerHTML = "Admin";
                    document.getElementById("logoutOption").style.display = "block";
                    document.getElementById("changePwOption").style.display = "block";
                    
                    document.getElementById("search-btn").style.display = "block";
                    document.getElementById("typ-btn").style.display = "block";
                    document.getElementById("device-btn").style.display = "block";
                    document.getElementById("log-btn").style.display = "block";

                }else if (data == false){

                    document.getElementById("user").innerHTML = "Beobachter";
                    document.getElementById("loginOption").style.display = "block";
                    
                    document.getElementById("search-btn").style.display = "block";
                    document.getElementById("typ-btn").style.display = "none";
                    document.getElementById("device-btn").style.display = "none";
                    document.getElementById("log-btn").style.display = "none";
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData(param);
    }else {
        
        document.getElementById("user").innerHTML = "Beobachter";
        document.getElementById("loginOption").style.display = "block";
        
        document.getElementById("search-btn").style.display = "block";
        document.getElementById("typ-btn").style.display = "none";
        document.getElementById("device-btn").style.display = "none";
        document.getElementById("log-btn").style.display = "none";
    }

    // ---------- Load Charts ----------

    async function loadChart() {
        const response = await fetch("/device_status_stats");
        const stats = await response.json();

        const labels = Object.keys(stats);
        const data = Object.values(stats);
        const total = data.reduce((a, b) => a + b, 0);

        document.getElementById("totalDevices").innerText = total;

        const colors = [
        "#A5E1CD", "#FF7D7D", "#CFC4FF", "#FFD579",
        ];

        new Chart(document.getElementById("statusChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
            data: data,
            backgroundColor: colors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: "bottom",
                labels: {
                generateLabels: function(chart) {
                    const dataset = chart.data.datasets[0];
                    return chart.data.labels.map((label, i) => {
                    const value = dataset.data[i];
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return {
                        text: `${label} (${percentage}%)`,
                        fillStyle: dataset.backgroundColor[i],
                        strokeStyle: dataset.backgroundColor[i],
                        lineWidth: 1,
                        hidden: false,
                        index: i
                    };
                    });
                }
                }
            },
            }
        }
        });
    }

    loadChart();
}

function handleResize() {
    if (window.innerWidth < 500) {
        document.getElementById("projectTitle").innerHTML = "HMT"
    }else{
        document.getElementById("projectTitle").innerHTML = "Hardware Management Tool"
    }
}

handleResize();

const delay = ms => new Promise(res => setTimeout(res, ms));

function toLog(){
    window.location.href = "/log";
}

function toSearch(){
    window.location.href = "/search";
}

function toDevice(){
    window.location.href = "/creat_device"
}

function toType(){
    window.location.href = "/creat_type"
}

function toHome(){
    window.location.href = "/"
}

// ---------- Login Popup ----------

function toggleDropdown() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
}

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
            const response = await fetch('/check_password', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({param})
            });

            const data = await response.json();
            console.log(data[0])

            if (data[0] == true) {

                document.getElementById("infoBoxLogin").style.borderColor = "#a5e1cd"
                document.getElementById("infoTextLogin").innerHTML = "Anmeldung erfolgreich"

                document.getElementById("infoBoxLogin").style.display = "block"
                document.getElementById("infoTextLogin").style.display = "block"

                sessionStorage.setItem("loginKey", data[1]);
                await delay(1000);
                toHome();

            } else if (data[0] == false) {

                document.getElementById("infoBoxLogin").style.borderColor = "#ff7d7d"
                document.getElementById("infoTextLogin").innerHTML = "Password inkorrekt"

                document.getElementById("infoBoxLogin").style.display = "block"
                document.getElementById("infoTextLogin").style.display = "block"

            }else {

                document.getElementById("infoBoxLogin").style.borderColor = "#ffd579"
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
            const response = await fetch('/check_password', {

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
                            const response = await fetch('/update_password', {

                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({newParam})
                            });

                            const data = await response.json();

                            if (data == true) {

                                document.getElementById("infoBoxChangePW").style.borderColor = "#a5e1cd"
                                document.getElementById("infoTextChangePW").innerHTML = "Passwort änderung erfolgreich"

                                document.getElementById("infoBoxChangePW").style.display = "block"
                                document.getElementById("infoTextChangePW").style.display = "block"

                                await delay(1000);
                                toHome();

                            }else {

                                document.getElementById("infoBoxChangePW").style.borderColor = "#ffd579"
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

                    document.getElementById("infoBoxChangePW").style.borderColor = "#ffd579"
                    document.getElementById("infoTextChangePW").innerHTML = "Wiederholtes Password nicht ident mit neuem Passwort"

                    document.getElementById("infoBoxChangePW").style.display = "block"
                    document.getElementById("infoTextChangePW").style.display = "block"

                }else if (newPasswort.value == "" && repeatPasswort.value == ""){

                    document.getElementById("infoBoxChangePW").style.borderColor = "#ffd579"
                    document.getElementById("infoTextChangePW").innerHTML = "Neues Passwort ist nicht erlaubt"

                    document.getElementById("infoBoxChangePW").style.display = "block"
                    document.getElementById("infoTextChangePW").style.display = "block"
                }

            } else if (data[0] == false) {

                document.getElementById("infoBoxChangePW").style.borderColor = "#ff7d7d"
                document.getElementById("infoTextChangePW").innerHTML = "Password inkorrekt"

                document.getElementById("infoBoxChangePW").style.display = "block"
                document.getElementById("infoTextChangePW").style.display = "block"

            }else {

                document.getElementById("infoBoxChangePW").style.borderColor = "#ffd579"
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
            const response = await fetch('/logout', {

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
