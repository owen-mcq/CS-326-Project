const btn = document.querySelector(".dropBtn");
const side = document.querySelector(".side");
const shadow = document.querySelector(".shadow");




async function getStock(){
    try{
        const res = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NVDA&apikey=0JAEERK0N1IZULFV");
        return await res.json();
    }catch(err){
        throw new Error("Error fetching",err);
    }
}

async function getStockDetails() {
    const stockData = await getStock();
    const timeSeries = stockData["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    const stock = {
        symbol: "NVDA",
        price: parseFloat(latestData["4. close"]),
        change: 0,
        high52: 0,
        low52: 0,
        volume: parseInt(latestData["5. volume"]),
        marketCap: 0
    };
    console.log(stock);
}

getStockDetails();
  
//This function will fill in the, for now empty, rows in the watchlist page
function generateGridElements(rows, columns) {
    let gridContainer = document.querySelector('.grid-container'); // Select the grid container
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let div = document.createElement('div'); // Create a new div element
            gridContainer.appendChild(div); // Append the div to the grid container
        }
    }
}

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

generateGridElements(15, 8);