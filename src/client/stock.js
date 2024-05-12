import { addStock, getStock, deleteAllStocks } from "./db.js";

document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker');


    if (ticker) {
        console.log("Ticker received: ", ticker);
    }


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
                window.location.href = `./singlestock.html`;
            }
        });
    }
});
