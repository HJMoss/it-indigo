let chartInstance = null;

async function getWeatherForecast() {
    const locationInput = document.getElementById('locationInput');
    const locationValue = locationInput.value;
    const errorSpan = document.getElementById('locError');
    const resultsContainer = document.getElementById('results-container');

    errorSpan.innerText = "";
    if (!locationValue.trim()) {
        errorSpan.innerText = "Error: Location is required. Please enter a city.";
        resultsContainer.style.display = "none";
        return;
    }

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationValue)}&count=1&language=en&format=json`;
        
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorSpan.innerText = "Error: No match found for that location.";
            resultsContainer.style.display = "none";
            return;
        }

        const city = geoData.results[0];

        document.getElementById('location-info').innerHTML = `
            <p style="font-size: 24px; margin: 0;"><strong>Name:</strong> ${city.name}</p>
            <p><strong>Admin1:</strong> ${city.admin1 || 'N/A'}</p>
            <p><strong>Country:</strong> ${city.country}</p>
        `;
        document.getElementById('coord-list').innerHTML = `
            <li><strong>Latitude:</strong> ${city.latitude.toFixed(4)}</li>
            <li><strong>Longitude:</strong> ${city.longitude.toFixed(4)}</li>
        `;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m&temperature_unit=fahrenheit`;
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        renderWeatherContent(weatherData);
        resultsContainer.style.display = "block";

    } catch (err) {
        errorSpan.innerText = "An error occurred fetching the data. Please try again.";
        console.error(err);
    }
}

function renderWeatherContent(data) {
    const tableBody = document.getElementById('forecastBody');
    tableBody.innerHTML = "";
    
    const times = data.hourly.time;
    const temps = data.hourly.temperature_2m;
    
    let labels = [];
    let values = [];

    for (let i = 0; i < times.length; i++) {
        let unixmillsec = Date.parse(times[i]);
        let tmpdate = new Date(unixmillsec);
        let friendlyDate = tmpdate.toLocaleString();

        labels.push(friendlyDate);
        values.push(temps[i]);

        let row = `<tr><td>${friendlyDate}</td><td>${temps[i]}°F</td></tr>`;
        tableBody.innerHTML += row;
    }

    const ctx = document.getElementById('weatherChart').getContext('2d');
    if (chartInstance) { chartInstance.destroy(); }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '7-Day Temperature (°F)',
                data: values,
                borderColor: '#3A3A39',
                backgroundColor: 'rgba(58, 58, 57, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 7,
                        color: '#939393'
                    },
                    grid: { display: false } 
                },
                y: {
                    ticks: { color: '#939393' },
                    grid: { color: '#eee' }
                }
            }
        }
    });
}