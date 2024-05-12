import { addStock, getStock, deleteAllStocks } from "./db.js";

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker');

    if (ticker) {
        console.log("Ticker received: ", ticker);
        // Implement additional functionality as needed with the ticker
    }

    // Example of existing DOM manipulation and event handling
    const profiles = document.querySelectorAll("#team li");
    const btn = document.querySelector(".dropBtn");
    const side = document.querySelector(".side");
    const shadow = document.querySelector(".shadow");
    const search = document.querySelector(".search [type='text']");

    if (btn) {
        btn.addEventListener("click", function () {
            side.classList.toggle("on");
            shadow.classList.toggle("on");
        });
    }

    if (shadow) {
        shadow.addEventListener("click", function () {
            side.classList.remove("on");
            shadow.classList.remove("on");
        });
    }

    profiles.forEach((profile) => {
        profile.addEventListener("click", function () {
            const bio = this.querySelector(".bio");
            bio.classList.toggle("show");
            bio.style.display = bio.style.display === "block" ? "none" : "block";
        });
    });

    if (search) {
        search.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                const stock = search.value.trim();
                if (stock !== "" && stock !== "clear") {
                    await addStock(stock);
                    console.log(await getStock(stock));
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
