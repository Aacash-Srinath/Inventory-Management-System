$(document).ready(function() {
    // Retrieve favorite product IDs from local storage
    const productIds = JSON.parse(localStorage.getItem('favID')) || [];

    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    
    // Fetch favorite records from the database based on product IDs
    $.ajax({
        url: 'get_favorites.php', 
        type: 'POST',
        data: { productIds: productIds },
        datatype: "json", 
        processing: true,
        serverSide: true,
        dataSrc: '',
        success: function(data) {
            const favoritesTable = $('#favoritesTable').DataTable({
                data: JSON.parse(data),
                columns: [
                    { data: "serialNo" },
                    { data: 'batchId' },
                    { data: 'productId' },
                    { data: 'stockingDate' },
                    { data: 'nextRestock' },
                    { data: 'manufacturingDate' },
                    { data: 'shippingCompany' },
                    { data: 'shippingStatus' },
                    { data: 'quantity' },
                    {
                        data: null,
                        render: function(data, type, row) {
                            // Check if this record is bookmarked
                            const isChecked = storedFavorites[row.productId] ? 'checked' : '';
                            return `<label class="custom-checkbox">
                                <input type="checkbox" class="favorite-checkbox" data-product-id="${row.productId}" ${isChecked}>
                                <span class="checkmark"></span>
                            </label>`;
                        }
                    }
                ]
            });

            function updateFavorites(productId, isChecked) {
                if (isChecked) {
                    storedFavorites[productId] = true;
                } else {
                    delete storedFavorites[productId];
                }
                const favoriteProductIds = Object.keys(storedFavorites);
                localStorage.setItem('favID', JSON.stringify(favoriteProductIds));
                localStorage.setItem('favorites', JSON.stringify(storedFavorites));
            }
            
            // Handle favorite-checkbox change event
            $('#favoritesTable tbody').on('change', '.favorite-checkbox', function () {
                const productId = $(this).data('product-id');
                const isChecked = $(this).prop('checked');
                updateFavorites(productId, isChecked);
            });
            
            // Set the initial state of checkboxes based on storedFavorites
            $('.favorite-checkbox').each(function () {
                const productId = $(this).data('product-id');
                if (storedFavorites[productId]) {
                    $(this).prop('checked', true);
                } else {
                    delete storedFavorites[productId];
                }
            });

            const searchForm = document.querySelector("form");
            const searchBar = document.getElementById("search-bar");
            searchForm.addEventListener("submit", function (event) {
                if (searchBar.value.trim() == "") {
                    // The search bar is empty, show an alert
                    alert("Enter a Search Value!!");
                    event.preventDefault(); // Prevent the form from submitting
                } else {
                    window.location.href = "search.html";
                }
            });
        }
    });
});
