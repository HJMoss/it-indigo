const fetchBtn = document.getElementById('fetchBtn');
const displayArea = document.getElementById('river-message');

const PIDS = [
    "USGS-07055646", 
    "USGS-07055660", 
    "USGS-07055680", 
    "USGS-07056000", 
    "USGS-07056700"
];

const SITE_NAMES = {
    "USGS-07055646": "Boxley",
    "USGS-07055660": "Ponca",
    "USGS-07055680": "Pruitt",
    "USGS-07056000": "St. Joe",
    "USGS-07056700": "Harriet (Hwy 14)"
};

fetchBtn.addEventListener('click', async () => {
    displayArea.innerHTML = "<em>Updating river data...</em>";

    const baseUrl = "https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items";
    
    const queryParams = new URLSearchParams({
        "f": "json",
        "monitoring_location_id": PIDS.join(','),
        "parameter_code": "00065",
        "time": "P7D",
        "properties": "monitoring_location_id,time,value,unit_of_measure",
        "skipGeometry": "true",
        "limit": "15000"
    });

    const targetUrl = `${baseUrl}?${queryParams.toString()}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const json = await response.json();
        const features = json.features;

        const siteGroups = {};
        PIDS.forEach(id => siteGroups[id] = []);

        features.forEach(item => {
            const id = item.properties.monitoring_location_id;
            if (siteGroups[id]) {
                siteGroups[id].push({
                    timestamp: new Date(item.properties.time),
                    val: parseFloat(item.properties.value)
                });
            }
        });

        displayArea.innerHTML = ""; 

        for (const id in siteGroups) {
            const site = siteGroups[id];
            if (site.length === 0) continue;

            site.sort((a, b) => a.timestamp - b.timestamp);
            const latest = site[site.length - 1];
            
            const section = document.createElement('div');
            section.className = "site-card";
            section.innerHTML = `
                <h3>${SITE_NAMES[id]}</h3>
                <p>Gage Height: <span class="gage-val">${latest.val} ft</span> 
                   <span class="timestamp-text">(Refreshed: ${latest.timestamp.toLocaleTimeString()})</span>
                </p>
                <div class="chart-wrapper"><canvas id="ctx-${id}"></canvas></div>
            `;
            displayArea.appendChild(section);

            new Chart(document.getElementById(`ctx-${id}`), {
                type: 'line',
                data: {
                    labels: site.map(r => r.timestamp.toLocaleDateString([], {month:'numeric', day:'numeric'})),
                    datasets: [{
                        data: site.map(r => r.val),
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.05)',
                        fill: true,
                        pointRadius: 0,
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                        x: { 
                            display: true, 
                            grid: { display: false },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 7, 
                                font: { size: 11 },
                                maxRotation: 0
                            }
                        }, 
                        y: { 
                            display: true,
                            beginAtZero: false,
                            ticks: { 
                                font: { size: 10 },
                                callback: function(value) {
                                    return value + ' ft';
                                }
                            }
                        } 
                    }
                }
            });
        }
    } catch (err) {
        displayArea.innerHTML = `<p style="color:red;">Error loading data: ${err.message}</p>`;
        console.error(err);
    }
});