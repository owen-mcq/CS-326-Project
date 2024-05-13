document.addEventListener("DOMContentLoaded", function () {
  // Get all profiles
  const profiles = document.querySelectorAll("#team li");
  const btn = document.querySelector(".dropBtn");
  const side = document.querySelector(".side");
  const shadow = document.querySelector(".shadow");
  const search = document.querySelector(".search [type='text']");

  //Brings out the sidebar when the menu button is clicked
  if (btn) {
    btn.addEventListener("click", function () {
      side.classList.toggle("on");
      shadow.classList.toggle("on");
    });
  }

  //When the user clicks on any area that is not the side bar it will close the sidebar
  if (shadow) {
    shadow.addEventListener("click", function () {
      side.classList.remove("on");
      shadow.classList.remove("on");
    });
  }
  profiles.forEach((profile) => {
    profile.addEventListener("click", function () {
      // Find bio section and toggle it to show
      const bio = this.querySelector(".bio");
      bio.classList.toggle("show");
      if (bio.style.display === "block") {
        bio.style.display = "none";
      } else {
        bio.style.display = "block";
      }
    });
  });

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

// home page watchlist implementation
const watchList = document.querySelector('.watchList')
let tickers = ["AAPL","TSLA","NVDA","GOOGL","MSFT","RACE","GE","AMC","GME","AMZN","INTC","META"];

async function fetchStock(ticker){
  try{
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`);
      if (!response.ok) {
          console.error("Failed to fetch data for:", ticker);
          return null;
      }
      return await response.json();
  }catch(err){
      console.error("Error fetching data for", ticker);
      return null;
  }
}

async function update() {
  watchList.innerHTML =
      '<div>Ticker</div>' +
      '<div>Price</div>' +
      '<div>+%/-%</div>';
  const shuffledTickers = tickers.sort(() => Math.random() - 0.5);

  const selectedTickers = shuffledTickers.slice(0, 5);

  for (const ticker of selectedTickers){
      const stockData = await fetchStock(ticker);
      if (!stockData) continue;

      const outputObj = {
          symbol: ticker,
          currentPrice: stockData.c,
          percentChange: stockData.dp,
      };

      watchList.insertAdjacentHTML('beforeend', `
          <div>${outputObj.symbol}</div>
          <div>${outputObj.currentPrice}</div>
          <div>${outputObj.percentChange}%</div>
      `);
  }
}


update();

//line chart implementation
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
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
      console.error("Failed to fetch data for:", ticker);
      return null;
    }
    const responseData = await response.json();
    return responseData.results;
  } catch (error) {
    console.error("Error fetching data for", ticker, error);
    return null;
  }
}

async function createChart(ticker){
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




async function randomChart() {
  let tickers = ["AAPL","TSLA","NVDA","GOOGL","MSFT","RACE","GE","AMC","GME","AMZN","INTC","META"];
  const randomIndex = Math.floor(Math.random() * tickers.length);
  createChart(tickers[randomIndex]);
}

randomChart();

async function fetchNews() {
  let tickers = ["AAPL","TSLA","NVDA","GOOGL","MSFT","RACE","GE","AMC","GME","AMZN","INTC","META"];
  const randomIndex = Math.floor(Math.random() * tickers.length);
  const random = tickers[randomIndex]
  try{
      //Get api for name of stock and the news
      const url = `https://finnhub.io/api/v1/company-news?symbol=${random}&from=2020-08-15&to=2024-05-02&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
      const nameUrl = `https://finnhub.io/api/v1/search?q=${random}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`;
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
      }).slice(0,2);
      //Checks ticker if company returns nothing
      if (filteredData.length === 0) {
          filteredData = data.filter((news) => {
              return news.summary.toLowerCase().includes(random.toLowerCase());
          }).slice(0,2);
      }
      displayNews(filteredData);
  }catch(err){
      console.error(err);
  }
}

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

fetchNews();
