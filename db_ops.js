
// Event listener for form submission
document.getElementById('recordForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get values from the form
    const serialNo = document.getElementById('serialNo').value;
    const batchID = document.getElementById('batchID').value;
    const productID = document.getElementById('productID').value;
    const stockingDate = document.getElementById('stockingDate').value;
    const nextRestock = document.getElementById('nextRestock').value;
    const manufacturingDate = document.getElementById('manufacturingDate').value;
    const shippingCompany = document.getElementById('shippingCompany').value;
    const shippingStatus = document.getElementById('shippingStatus').value;
    const quantity = document.getElementById('quantity').value;
            

    // Create a FormData object to send the data
    const formData = new FormData();
    formData.append('serialNo', serialNo);
    formData.append('batchID', batchID);
    formData.append('productID', productID);
    formData.append('stockingDate', stockingDate);
    formData.append('nextRestock', nextRestock);
    formData.append('manufacturingDate', manufacturingDate);
    formData.append('shippingCompany', shippingCompany);
    formData.append('shippingStatus', shippingStatus);
    formData.append('quantity', quantity);

    // Send a POST request to the PHP script
    fetch('insert_record.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Reset the form
    this.reset();
});

// Function to fetch records from the Database to be displayed in the Edit Record Tab
function getRecord() {
    const editSerialNo = document.getElementById('editSerialNo').value;
    // Make an AJAX request to retrieve the record for the given serial number
    $.ajax({
        type: 'POST',
        url: 'get_record.php', // Replace with your PHP endpoint
        data: { serialNo: editSerialNo },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // Populate form fields with retrieved data
                const record = response.record;
                document.getElementById('editBatchID').value = record.batchId;
                document.getElementById('editProductID').value = record.productId;
                document.getElementById('editStockingDate').value = record.stockingDate;
                document.getElementById('editNextRestock').value = record.nextRestock;
                document.getElementById('editManufacturingDate').value = record.manufacturingDate;
                document.getElementById('editShippingCompany').value = record.shippingCompany;
                document.getElementById('editShippingStatus').value = record.shippingStatus;
                document.getElementById('editQuantity').value = record.quantity;
            } else {
                alert('Record Not Found!!');
            }
        },
        error: function () {
            alert('Error Fetching Record!!');
        }
    });
}

// Function to fetch records from the Database to be displayed in the Delete Record Tab
function getDRecord() {
    const delSerialNo = document.getElementById('delSerialNo').value;
    // Make an AJAX request to retrieve the record for the given serial number
    $.ajax({
        type: 'POST',
        url: 'get_record.php', // Replace with your PHP endpoint
        data: { serialNo: delSerialNo },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                // Populate form fields with retrieved data
                const record = response.record;
                document.getElementById('delBatchID').value = record.batchId;
                document.getElementById('delProductID').value = record.productId;
                document.getElementById('delStockingDate').value = record.stockingDate;
                document.getElementById('delNextRestock').value = record.nextRestock;
                document.getElementById('delManufacturingDate').value = record.manufacturingDate;
                document.getElementById('delShippingCompany').value = record.shippingCompany;
                document.getElementById('delShippingStatus').value = record.shippingStatus;
                document.getElementById('delQuantity').value = record.quantity;
            } else {
                alert('Record Not Found!!');
            }
        },
        error: function () {
            alert('Error Fetching Record!!');
        }
    });
}

// Event Listener for Form Submission of Edit Tab
document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();
    updateRecord();
    this.reset();
});


// Function to update record to the Database in the Edit Record Tab
function updateRecord() {
    // Get values from form fields
    const editSerialNo = document.getElementById('editSerialNo').value;
    const editBatchID = document.getElementById('editBatchID').value;
    const editProductID = document.getElementById('editProductID').value;
    const editStockingDate = document.getElementById('editStockingDate').value;
    const editNextRestock = document.getElementById('editNextRestock').value;
    const editManufacturingDate = document.getElementById('editManufacturingDate').value;
    const editShippingCompany = document.getElementById('editShippingCompany').value;
    const editShippingStatus = document.getElementById('editShippingStatus').value;
    const editQuantity = document.getElementById('editQuantity').value;

    // Prepare data to send to the server
    const data = {
        serialNo: editSerialNo,
        batchId: editBatchID,
        productId: editProductID,
        stockingDate: editStockingDate,
        nextRestock: editNextRestock,
        manufacturingDate: editManufacturingDate,
        shippingCompany: editShippingCompany,
        shippingStatus: editShippingStatus,
        quantity: editQuantity
    };

    // Make an AJAX request to update the record in the database
    $.ajax({
        type: 'POST',
        url: 'update_record.php', 
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('Record Updated Successfully!');
            }
        },
        error: function () {
            alert('Error Updating Record!!');
        }
    });
}

// Event Listener for Form Submission of Delete Tab
document.getElementById('deleteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    deleteRecord();
    this.reset();
});


// Function to Delete Record from the Database in the Delete Record Tab
function deleteRecord() {
    // Get value from form field
    const delSerialNo = document.getElementById('delSerialNo').value;

    const data = {
        serialNo: delSerialNo
    };

    $.ajax({
        type: 'POST',
        url: 'delete_record.php', // Replace with your PHP endpoint
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('Record Deleted Successfully!!');
            }
        },
        error: function () {
            alert('Error Deleting Record!!');
        }
    });

}