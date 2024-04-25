const btn = document.querySelector(".dropBtn");
const side = document.querySelector(".side");
const shadow = document.querySelector(".shadow");

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