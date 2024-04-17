document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector("form");
    const searchBar = document.getElementById("search-bar");
    console.log('Search Bar Value = "' + searchBar.value + '"');
    searchForm.addEventListener("submit", function (event) {
        if (searchBar.value.trim() == "") {
            // The search bar is empty, show an alert
            alert("Enter a Search Value!!");
            event.preventDefault(); // Prevent the form from submitting
        } else {
            window.location.href = "search.html";
        }
    });
});
