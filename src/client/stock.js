

document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker');

    const addStockBtn = document.querySelector('#addStockBtn');
    const removeStockBtn = document.querySelector('#removeStockBtn');

    /**
     * Handles adding a stock to the watchlist when the add stock button is clicked.
     */
    addStockBtn.addEventListener("click", async function() {
        try {
            const response = await fetch(`/stock.html/${encodeURIComponent(ticker)}`, {
                method: 'POST',
            });
        } catch (err){
            console.error("Failed to fetch data for:", ticker);
        }
    });
    /**
     * Handles removing a stock from the watchlist when the remove stock button is clicked.
     */
    removeStockBtn.addEventListener("click", async function () {
        try {
            const response = await fetch(`/stock.html/${encodeURIComponent(ticker)}`, {
                method: 'DELETE',
            });
        } catch (err){
            console.error("Failed to fetch data for:", ticker);
        }
    });
    /**
     * Fetches stock profile data for a given ticker symbol from a financial API and displays it.
     * 
     * @async
     * @function fetchStockdata
     * @param {string} ticker - The stock ticker symbol to fetch data for.
     */
    async function fetchStockdata(ticker) {
        try {
            const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
            const response = await fetch(url);
            const data = await response.json();
            displayNerdData(data);
        } catch (error){
            console.error("Error fetching data for", ticker);
        }

    }
    /**
     * Fetches earnings data for a given stock ticker symbol from a financial API and displays it.
     * 
     * @async
     * @function fetchEarnings
     * @param {string} ticker - The stock ticker symbol to fetch earnings data for.
     */
    async function fetchEarnings(ticker){
        try {
            const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
            const response = await fetch(url);
            const data = await response.json();
            displayEarnings(data);
        }catch(err){
            console.error(err);
        }
    }
    /**
     * Fetches news articles related to a specific stock ticker symbol and displays them.
     * 
     * @async
     * @function fetchNews
     * @param {string} ticker - The stock ticker symbol to fetch news for.
     */
    async function fetchNews(ticker) {
        try{
            //Get api for name of stock and the news
            const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=2020-08-15&to=2024-05-02&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
            const nameUrl = `https://finnhub.io/api/v1/search?q=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
            //Extract data
            const nameResponse = await fetch(nameUrl);
            const nameData = await nameResponse.json();
            //Get company's first name, capitalize the first lettr
            const firstNameRaw = nameData.result[0].description.split(' ')[0];
            const companyName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase();
            const response = await fetch(url);
            const data = await response.json();
            //Filter all the news articles to find 3 articles with the companies name
            let filteredData = data.filter((news) => {
                return news.summary.toLowerCase().includes(companyName.toLowerCase());
            }).slice(0,3);
            //Checks ticker if company returns nothing
            if (filteredData.length === 0) {
                filteredData = data.filter((news) => {
                    return news.summary.toLowerCase().includes(ticker.toLowerCase());
                }).slice(0,3);
            }
            displayNews(filteredData);
        }catch(err){
            console.error(err);
        }
    }
    /**
     * Displays stock profile data on the webpage.
     * 
     * @function displayNerdData
     * @param {object} data - The stock profile data to display.
     */
    function displayNerdData(data) {
        const div = document.getElementById('stockDetails');
        const logo = document.getElementById('stockLogo');
        let logoImg = `<img src="${data.logo}" alt="${data.name} logo" style="width: 100px; height: auto;">`;
        let content = `<h2>Stock Data for ${data.ticker}</h2>`;
        content += `<p><strong>Exchange:</strong> ${data.exchange}</p>`;
        content += `<p><strong>Industry:</strong> ${data.finnhubIndustry}</p>`;
        content += `<p><strong>IPO Date:</strong> ${data.ipo}</p>`;
        content += `<p><strong>Market Cap:</strong> ${data.marketCapitalization.toLocaleString()} Million USD</p>`;
        content += `<p><strong>Shares Outstanding:</strong> ${data.shareOutstanding.toLocaleString()} Million Shares</p>`;
        logo.innerHTML = logoImg;
        div.innerHTML = content;
    }
    /**
     * Displays news articles on the webpage.
     * 
     * @function displayNews
     * @param {Array<object>} data - An array of news articles to display.
     */
    function displayNews(data) {
        const div = document.querySelector('.news');
        div.innerHTML = "<h2 style=\"color: #333333\">News</h2>";
        data.forEach((news) => {
            //Check if it image exists
            const imageHTML = news.image ? `<img src="${news.image}" class="newsImg">` : '';
            const content = `
                <div class="newsObj">
                    ${imageHTML}
                    <div class="newsText">
                        <h3 style="color: green">${news.headline}</h3>
                        <p>${news.summary}</p>
                        <p><a href="${news.url}" target="_blank">Read more...</a></p>
                    </div>
                </div>
            `;
            div.innerHTML += content;
        });
    }
    /**
     * Displays earnings data on the webpage.
     * 
     * @function displayEarnings
     * @param {Array<object>} data - An array of earnings data objects.
     */
    function displayEarnings(data) {
        const div = document.querySelector('.earnings');
        const mostRecentData = data[0];
        div.innerHTML = "";
        const content = `
            <div class="report">
                <h3>Earnings Report for Q${mostRecentData.quarter} ${mostRecentData.year}</h3>
                <p><strong>Actual:</strong> ${mostRecentData.actual}</p>
                <p><strong>Estimate:</strong> ${mostRecentData.estimate}</p>
                <p><strong>Surprise:</strong> ${mostRecentData.surprise} (${mostRecentData.surprisePercent}%)</p>
            </div>
        `
        div.innerHTML += content;
    }
    /**
     * Formats a date object into a string in the "YYYY-MM-DD" format.
     * 
     * @function formatDate
     * @param {Date} date - The date object to format.
     * @returns {string} The formatted date string.
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * Fetches historical stock data for a given ticker symbol within the last month.
     * 
     * @async
     * @function fetchData
     * @param {string} ticker - The stock ticker symbol to fetch data for.
     * @returns {Promise<Array<object>|null>} A Promise that resolves to an array of historical stock data objects if successful, otherwise null.
     */
    async function fetchData(ticker){
        try {
            // Get current date and one month ago
            const today = new Date();
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            // Format dates as YYYY-MM-DD strings
            const fromDate = formatDate(oneMonthAgo);
            const toDate = formatDate(today);

            const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=tYHWJdiKKmPmS_7BRZ9Ixii0XHITWPbf`);
            if (!response.ok) {
                alert("Too many API calls, please retry shortly");
                return null;
            }
            const responseData = await response.json();
            return responseData.results;
        } catch (error) {
            console.error("Error fetching data for", ticker, error);
            return null;
        }
    }
    /**
     * Creates a line chart displaying historical stock data for a given ticker symbol within the last month.
     * 
     * @async
     * @function createChart
     * @param {string} ticker - The stock ticker symbol to create the chart for.
     */
    async function createChart(ticker) {
        ticker = ticker.toUpperCase();
        try {
            const data = await fetchData(ticker);
            const chartData = {
                labels: [],
                datasets: [{
                    label: `${ticker} 1 Month Chart`,
                    data: [],
                    fill: false,
                    borderColor: 'rgb(0, 100, 30)',
                    tension: 0.1
                }]
            };

            for (const result of data) {
                chartData.labels.push(new Date(result.t).toLocaleDateString());
                chartData.datasets[0].data.push(result.c);
            }
            const canvas = document.getElementById('myChart');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        tooltip: {
                            titleFont: {
                                color: 'black'
                            },
                            bodyFont: {
                                color: 'black'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    }

    fetchEarnings(ticker);
    fetchStockdata(ticker);
    fetchNews(ticker);
    createChart(ticker);
    // Get all profiles
    const profiles = document.querySelectorAll("#team li");
    const btn = document.querySelector(".dropBtn");
    const side = document.querySelector(".side");
    const shadow = document.querySelector(".shadow");
    const search = document.querySelector(".search [type='text']");

    /**
     * Brings out the sidebar when the menu button is clicked.
     */
    if (btn) {
        btn.addEventListener("click", function () {
            side.classList.toggle("on");
            shadow.classList.toggle("on");
        });
    }

    /**
     * Closes the sidebar when the user clicks on any area that is not the sidebar.
     */
    if (shadow) {
        shadow.addEventListener("click", function () {
            side.classList.remove("on");
            shadow.classList.remove("on");
        });
    }

    /**
     * Checks if a given stock ticker symbol is valid by fetching its profile data from a financial API.
     * 
     * @async
     * @function isValid
     * @param {string} ticker - The stock ticker symbol to validate.
     * @returns {Promise<boolean>} A Promise that resolves to true if the ticker symbol is valid, otherwise false.
     */
    async function isValid(ticker){
        const nameUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
        const response = await fetch(nameUrl);
        if (!response.ok) {
            return false;
        } else {
            const data = await response.json();
            console.log(data);
            if (Object.keys(data).length === 0) {
                return false;
            } else {
                return true;
            }
        }
    }
    /**
     * Handles the search functionality by redirecting to the stock page if a valid ticker symbol is entered.
     * @param {KeyboardEvent} event - The keydown event object.
     */
    if (search) {
        search.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                const stock = search.value.trim();
                console.log(await isValid(stock));
                if (stock !== "" && await isValid(stock)) {
                    window.location.href = `stock.html?ticker=${encodeURIComponent(stock)}`;
                    search.value = "";
                } else{
                    alert("Invalid Stock");
                    search.value = "";
                }
            }
        });
    }
});
