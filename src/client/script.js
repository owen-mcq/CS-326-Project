import { addStock, getStock, deleteAllStocks } from "./db.js";


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

  if (search) {
    search.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        const stock = search.value.trim();
        if (stock !== "" && stock !== "clear") {
          await addStock(stock);
          console.log( await getStock(stock));
          search.value = "";
        } else if (stock === "clear") {
          await deleteAllStocks();
          search.value = "";
        }
      } else if (event.key === "Control") {
          const ticker = search.value.trim();
          search.value = "";
          window.location.href = `stock.html?ticker=${encodeURIComponent(ticker)}`;
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
  const tickers = ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA", "SPOT"];
  const randomIndex = Math.floor(Math.random() * tickers.length);
  createChart(tickers[randomIndex]);
}

randomChart();

