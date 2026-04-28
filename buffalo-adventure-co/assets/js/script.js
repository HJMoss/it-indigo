// Store chart instances globally so we can destroy them on refresh
        var chart0, chart1, chart2, chart3, chart4;

        document.getElementById('fetchBtn').onclick = function() {
            var displayArea = document.getElementById('river-message');
            displayArea.innerHTML = "Fetching USGS Data...";

            // API URL featuring all 5 Buffalo River stations
            var apiUrl = "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items?f=json" +
                         "&monitoring_location_id=USGS-07055646,USGS-07055660,USGS-07055680,USGS-07056000,USGS-07056700" +
                         "&parameter_code=00065&time=P7D&limit=10000";

            fetch(apiUrl)
                .then(function(res) { return res.json(); })
                .then(function(msg) {
                    displayArea.innerHTML = "Success! Updating charts...";
                    var fLen = msg.features.length;

                    /* --- SITE 1: Boxley --- */
                    var sitecode1 = "USGS-07055646";
                    var dates1 = [];
                    var values1 = [];
                    for (var i = 0; i < fLen; i++) {
                        if (msg.features[i].properties.monitoring_location_id == sitecode1) {
                            values1.push(msg.features[i].properties.value);
                            dates1.push(new Date(msg.features[i].properties.time).toLocaleDateString());
                        }
                    }
                    if (chart0) chart0.destroy();
                    chart0 = new Chart(document.getElementById("chartjs-0"), {
                        type: "line",
                        data: { labels: dates1, datasets: [{ label: "Gage Height (ft)", data: values1, borderColor: "blue", fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                    /* --- SITE 2: Ponca --- */
                    var sitecode2 = "USGS-07055660";
                    var dates2 = [];
                    var values2 = [];
                    for (var i = 0; i < fLen; i++) {
                        if (msg.features[i].properties.monitoring_location_id == sitecode2) {
                            values2.push(msg.features[i].properties.value);
                            dates2.push(new Date(msg.features[i].properties.time).toLocaleDateString());
                        }
                    }
                    if (chart1) chart1.destroy();
                    chart1 = new Chart(document.getElementById("chartjs-1"), {
                        type: "line",
                        data: { labels: dates2, datasets: [{ label: "Gage Height (ft)", data: values2, borderColor: "green", fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                    /* --- SITE 3: Pruitt --- */
                    var sitecode3 = "USGS-07055680";
                    var dates3 = [];
                    var values3 = [];
                    for (var i = 0; i < fLen; i++) {
                        if (msg.features[i].properties.monitoring_location_id == sitecode3) {
                            values3.push(msg.features[i].properties.value);
                            dates3.push(new Date(msg.features[i].properties.time).toLocaleDateString());
                        }
                    }
                    if (chart2) chart2.destroy();
                    chart2 = new Chart(document.getElementById("chartjs-2"), {
                        type: "line",
                        data: { labels: dates3, datasets: [{ label: "Gage Height (ft)", data: values3, borderColor: "red", fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                    /* --- SITE 4: St. Joe --- */
                    var sitecode4 = "USGS-07056000";
                    var dates4 = [];
                    var values4 = [];
                    for (var i = 0; i < fLen; i++) {
                        if (msg.features[i].properties.monitoring_location_id == sitecode4) {
                            values4.push(msg.features[i].properties.value);
                            dates4.push(new Date(msg.features[i].properties.time).toLocaleDateString());
                        }
                    }
                    if (chart3) chart3.destroy();
                    chart3 = new Chart(document.getElementById("chartjs-3"), {
                        type: "line",
                        data: { labels: dates4, datasets: [{ label: "Gage Height (ft)", data: values4, borderColor: "orange", fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                    /* --- SITE 5: Harriet --- */
                    var sitecode5 = "USGS-07056700";
                    var dates5 = [];
                    var values5 = [];
                    for (var i = 0; i < fLen; i++) {
                        if (msg.features[i].properties.monitoring_location_id == sitecode5) {
                            values5.push(msg.features[i].properties.value);
                            dates5.push(new Date(msg.features[i].properties.time).toLocaleDateString());
                        }
                    }
                    if (chart4) chart4.destroy();
                    chart4 = new Chart(document.getElementById("chartjs-4"), {
                        type: "line",
                        data: { labels: dates5, datasets: [{ label: "Gage Height (ft)", data: values5, borderColor: "purple", fill: false }] },
                        options: { responsive: true, maintainAspectRatio: false }
                    });

                })
                .catch(function(err) {
                    console.error(err);
                    displayArea.innerHTML = "Error loading river data.";
                });
        };