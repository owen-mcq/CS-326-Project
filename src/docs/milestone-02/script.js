document.addEventListener("DOMContentLoaded", function() {
    // Get all profiles
    const profiles = document.querySelectorAll("#team li");
    const btn = document.querySelector(".dropBtn");
    const side = document.querySelector(".side");
    const shadow = document.querySelector(".shadow");
    const head = document.querySelector(".head");

    btn.addEventListener("click", function(){
        side.classList.toggle("on");
        shadow.classList.toggle("on");
    });

    shadow.addEventListener("click", function(){
        side.classList.remove("on");
        shadow.classList.remove("on");
    });

    profiles.forEach(profile => {
        profile.addEventListener("click", function() {
            // Find bio section and toggle it to show
            const bio = this.querySelector(".bio");
            bio.classList.toggle("show");
        });
    });
}); 
