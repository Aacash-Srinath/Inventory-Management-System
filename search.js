$(document).ready(function() {
    urlSearchParams = new URLSearchParams(window.location.search);
    searchValue = urlSearchParams.get('searchVal');
    value = searchValue;
    console.log(window.location.href);
    storedFavorites = {};
    
    inventoryTable = $('#inventoryTable').DataTable({
        ajax: {
            url: 'display_inventory.php', 
            datatype: "json", 
            contentType: "application/json; charset=UTF-8",
            processing: true,
            serverSide: true,
            dataSrc: ''
        },
        columns: [
            { data: 'serialNo' },
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
                    const isChecked = storedFavorites[row.productId] ? 'checked' : '';
                    return `                        
                        <label class="custom-checkbox">
                            <input type="checkbox" class="favorite-checkbox" data-product-id="${row.productId}" ${isChecked}>
                            <span class="checkmark"></span>
                        </label>                        
                        `;
                }
            }
        ]
    });

    if (value && value != 'all') {
        inventoryTable.search(value).draw();
    }
    if (value == 'all'){
        inventoryTable.draw();
    }
    
    inventoryTable.on('search', function() {
        const currentSearchValue = inventoryTable.search();
        if (!currentSearchValue) {
            localStorage.removeItem('searchVal'); 
            value='all';
        }
    });
});