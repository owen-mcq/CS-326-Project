document.addEventListener("DOMContentLoaded", function() {
    // Get all profile images
    const profileImages = document.querySelectorAll("#team li img");
    
    // Add click event listener to each profile image
    profileImages.forEach(image => {
        image.addEventListener("click", function() {
            // Toggle visibility of bio
            const bio = this.nextElementSibling;
            bio.classList.toggle("show");
        });
    });
}); 
