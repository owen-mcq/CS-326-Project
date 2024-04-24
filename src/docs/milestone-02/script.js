document.addEventListener("DOMContentLoaded", function() {
    // Get all profiles
    const profiles = document.querySelectorAll("#team li");
    const dropdownNavBar = document.querySelector(".dropdownNavBar");
    const links = document.querySelector(".links");
    // Add event listener to each profile
    dropdownNavBar.addEventListener("click", function(){
        links.classList.toggle("show");
    })
    profiles.forEach(profile => {
        profile.addEventListener("click", function() {
            // Find bio section and toggle it to show
            const bio = this.querySelector(".bio");
            bio.classList.toggle("show");
        });
    });
}); 
