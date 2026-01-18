// this is for changing the theme (dark mode / light mode)

function changeTheme() {

    var theme = localStorage.getItem("theme");

    if (theme != null) {

        if (theme == "dark") {
            document.getElementById('theme_style').href = "/static/darkstyle.css";
        } else if(theme == "light") {
            document.getElementById('theme_style').href = "/static/lightstyle.css";
        }

    } else {
         localStorage.setItem("theme", "light");
    }
}

// execute when page done loading

window.onload = function() {

    window.addEventListener('resize', handleResize);

    // display "Admin" or "Beobachter" and available options
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

                if (data == true) {

                    document.getElementById("user").innerHTML = "Admin";
                    document.getElementById("logoutOption").style.display = "block";
                    document.getElementById("changePwOption").style.display = "block";
                    document.getElementById("settingOption").style.display = "block";
                    
                    document.getElementById("search-btn").style.display = "block";
                    document.getElementById("typ-btn").style.display = "block";
                    document.getElementById("device-btn").style.display = "block";
                    document.getElementById("log-btn").style.display = "block";

                }else if (data == false){

                    document.getElementById("user").innerHTML = "Beobachter";
                    document.getElementById("loginOption").style.display = "block";
                    document.getElementById("settingOption").style.display = "block";
                    
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
        document.getElementById("settingOption").style.display = "block";
        
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
        const chartData = Object.values(stats);
        const total = chartData.reduce((a, b) => a + b, 0);

        document.getElementById("totalDevices").innerText = total;

        const colorMapping = {
            "Aktiv": "#A5E1CD",
            "Lager": "#CFC4FF",
            "Ausgeschieden": "#FF7D7D",
            "Verkauft": "#FFD579"
        };
        const backgroundColors = labels.map(label => colorMapping[label] || "#ffffff");

        const ctx = document.getElementById("statusChart");

        // Clear the previous chart instance if it exists
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        var theme = localStorage.getItem("theme");
        var labelColor = "#ffffff";

        if (theme == "dark") {
            labelColor = "#ffffff";                                  
        } else if(theme == "light") {
            labelColor = "#000000";
        }

        // Create a new chart instance
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: chartData,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
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
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.backgroundColor[i],
                                        lineWidth: 1,
                                        index: i,
                                        fontColor: labelColor
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

// When the size of the page is to small the title changes to "HMT"

function handleResize() {
    if (window.innerWidth < 500) {
        document.getElementById("projectTitle").innerHTML = "HMT"
    }else{
        document.getElementById("projectTitle").innerHTML = "Hardware Management Tool"
    }
}

handleResize();

// deley function

const delay = ms => new Promise(res => setTimeout(res, ms));

// sends you to "/log" page

function toLog(){
    window.location.href = "/log";
}

// sends you to "/search" page

function toSearch(){
    window.location.href = "/search";
}

// sends you to "/creat_device" page

function toDevice(){
    window.location.href = "/creat_device"
}

// sends you to "/creat_type" page

function toType(){
    window.location.href = "/creat_type"
}

// sends you to "/" page

function toHome(){
    window.location.href = "/"
}

// ---------- Login Popup ----------

function toggleDropdown() {
    const dropdownOptions = document.getElementById('dropdownOptions');
    dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
}

function toLogin() {

    document.getElementById("loginPopup").style.display = "block";
    document.getElementById("loginOverlay").style.display = "block";

    document.getElementById("infoBoxLogin").style.display = "none";
    document.getElementById("infoTextLogin").style.display = "none";

    document.getElementById("loginInput").value = "";
}

function closeToLogin() {

    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("loginOverlay").style.display = "none";
}

// ---------- Change Password Popup ----------

function toChangePW() {

    document.getElementById("pwPopup").style.display = "block";
    document.getElementById("pwOverlay").style.display = "block";

    document.getElementById("infoBoxChangePW").style.display = "none";
    document.getElementById("infoTextChangePW").style.display = "none";

    document.getElementById("currentPasswort").value = "";
    document.getElementById("repeatPasswort").value = "";
    document.getElementById("newPasswort").value = "";
}

function closeToChangePW() {

    document.getElementById("pwPopup").style.display = "none";
    document.getElementById("pwOverlay").style.display = "none";
}

// ---------- Settings Popup ----------

function toChangeSettings() {

    document.getElementById("settingsPopup").style.display = "block";
    document.getElementById("settingsOverlay").style.display = "block";
    document.getElementById("theme").value = ""+localStorage.getItem("theme")+"";
}

function closeToChangeSettings() {

    document.getElementById("settingsPopup").style.display = "none";
    document.getElementById("settingsOverlay").style.display = "none";
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
                            }body

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

function changeSettings(){

    localStorage.setItem("theme", ""+document.getElementById("theme").value+"");
    window.location.reload();
}