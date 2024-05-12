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
        window.location.href = `stock.html`;
      }
    });
  }
});

// home page watchlist implementation
const watchList = document.querySelector('.watchList')
let tickers = ["AAPL","TSLA","NVDA"];

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

  for (const ticker of tickers){
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
