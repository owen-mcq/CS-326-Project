import { addStock } from "./db.js";

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
    search.addEventListener("keypress", async (event) => {
      if (event.key === "Enter") {
        const stock = search.value.trim();
        if (stock !== "") {
          await addStock(stock);
          search.value = "";
        }
      }
    });
  }
});
