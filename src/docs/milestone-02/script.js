document.addEventListener("DOMContentLoaded", function() {
    // Get all profiles
    const profiles = document.querySelectorAll("#team li");
    
    // Add event listener to each profile
    profiles.forEach(profile => {
        profile.addEventListener("click", function() {
            // Find bio section and toggle it to show
            const bio = this.querySelector(".bio");
            bio.classList.toggle("show");
        });
    });
}); 
