document.addEventListener("DOMContentLoaded", () => {
    const baseCurrency = document.getElementById("baseCurrency");
    const convertCurrency = document.getElementById("convertCurrency");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const baseError = document.getElementById("baseError");
    const convertError = document.getElementById("convertError");
    const fromError = document.getElementById("fromError");
    const toError = document.getElementById("toError");
    const showBtn = document.getElementById("showResults");
    const clearBtn = document.getElementById("clearForm");

    let chart = null;

    // Set "To Date" to today by default
    const today = new Date().toISOString().split('T')[0];
    toDate.value = today;

    showBtn.addEventListener("click", () => {
        clearErrors();

        const base = baseCurrency.value;
        const convert = convertCurrency.value;
        const from = fromDate.value;   
        const to = toDate.value;       

        let valid = true;
        if (!base) { baseError.textContent = "Required"; valid = false; }
        if (!convert) { convertError.textContent = "Required"; valid = false; }
        if (!from) { fromError.textContent = "Required"; valid = false; }
        if (!to) { toError.textContent = "Required"; valid = false; }
        
        if (!valid) return;

        // Massive.com / Polygon API Settings
        const apiKey = "ER558Zzp7ZcMEbie_YNHLmv8WTybNtlA"; 
        const ticker = `C:${base}${convert}`;
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // IMPORTANT: Massive.com results are stored in data.results
                if (!data.results || data.results.length === 0) {
                    alert("No data found. Note: Free API data is delayed by 24 hours. Try a date range from last month.");
                    return;
                }

                // Map results: 't' is time (ms), 'c' is closing price
                let points = data.results.map(item => ({
                    x: item.t, 
                    y: item.c
                }));

                drawChart(points, base, convert);
            })
            .catch(err => {
                alert("API Connection Error. Please try again in 60 seconds.");
            });
    });

    clearBtn.addEventListener("click", () => {
        // Reset Inputs
        baseCurrency.value = "";
        convertCurrency.value = "";
        fromDate.value = "";
        toDate.value = today;

        // Reset Errors
        clearErrors();

        // Destroy Chart
        if (chart) {
            chart.destroy();
            chart = null;
        }
    });

    function clearErrors() {
        [baseError, convertError, fromError, toError].forEach(el => el.textContent = "");
    }

    function drawChart(points, base, convert) {
        const ctx = document.getElementById("chart").getContext('2d');
        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                datasets: [{
                    label: `${base} to ${convert}`,
                    data: points,
                    borderColor: "#2c3e50",
                    backgroundColor: "rgba(44, 62, 80, 0.1)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: { unit: "day" },
                        title: { display: true, text: "Date" }
                    },
                    y: {
                        title: { display: true, text: "Exchange Rate" }
                    }
                }
            }
        });
    }
});