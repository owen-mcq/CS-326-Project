const btn = document.querySelector(".dropBtn");
const side = document.querySelector(".side");
const shadow = document.querySelector(".shadow");
const gridContainer = document.querySelector('.grid-container'); // Select the grid container
const clearBtn = document.querySelector("#clear");
let tickers = await setStocks();

async function setStocks(){
    try {
        const response = await fetch('/watchlist.html/', {
            method: 'GET',
        });
        const stocks = await response.json();
        return stocks.map(stock => stock.name);
    } catch (err) {
        console.log("Failed to get stock names", err);
    }
}

clearBtn.addEventListener("click", async function(){
    try {
        const response = await fetch('/watchlist.html/', {
            method: 'DELETE',
        });
        if(response.ok) {
            gridContainer.innerHTML = ''; // Clear the grid immediately
            tickers = []; // Clear the tickers array since all stocks are deleted
        }
        await setStocks();
        await update();
    } catch (err) {
        console.log("Failed to get stock names", err);
    }
});

async function fetchStock(ticker){
    try{
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=corf4r1r01qm70u12bh0corf4r1r01qm70u12bhg`);
        if (!response.ok) {
            alert("Too many API calls, please retry shortly");
            return null;
        }
        return await response.json();
    }catch(err){
        console.error("Error fetching data for", ticker);
        return null;
    }
}

async function update() {
    gridContainer.innerHTML =
        '<div>Ticker</div>' +
        '<div>Price</div>' +
        '<div>Day Change</div>' +
        '<div>+%/-%</div>' +
        '<div>Day High</div>' +
        '<div>Day Low</div>' +
        '<div>Prev Close</div>';
    await setStocks();

    for (const ticker of tickers){
        const stockData = await fetchStock(ticker);
        if (!stockData) continue;

        const outputObj = {
            symbol: ticker,
            dayChange: stockData.d,
            currentPrice: stockData.c,
            highPrice: stockData.h,
            lowPrice: stockData.l,
            percentChange: stockData.dp,
            previousClose: stockData.pc
        };

        gridContainer.insertAdjacentHTML('beforeend', `
            <div>${outputObj.symbol}</div>
            <div>${outputObj.currentPrice}</div>
            <div>${outputObj.dayChange}</div>
            <div>${outputObj.percentChange}%</div>
            <div>${outputObj.highPrice}</div>
            <div>${outputObj.lowPrice}</div>
            <div>${outputObj.previousClose}</div>
        `);
    }
}

update();

//Brings out the sidebar when the menu button is clicked
btn.addEventListener("click", function(){
    side.classList.toggle("on");
    shadow.classList.toggle("on");
});

//When the user clicks on any area that is not the side bar it will close the sidebar
shadow.addEventListener("click", function(){
    side.classList.remove("on");
    shadow.classList.remove("on");
});
