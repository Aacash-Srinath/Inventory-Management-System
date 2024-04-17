<?php
// Database Configuration
$servername = "localhost:3307"; 
$username = "root"; 
$password = "";
$dbname = "ArcusInventory"; 

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get values from the POST request (client-side)
$serialNo = $_POST['serialNo'];
$batchID = $_POST['batchID'];
$productID = $_POST['productID'];
$stockingDate = $_POST['stockingDate'];
$nextRestock = $_POST['nextRestock'];
$manufacturingDate = $_POST['manufacturingDate'];
$shippingCompany = $_POST['shippingCompany'];
$shippingStatus = $_POST['shippingStatus'];
$quantity = $_POST['quantity'];

// Insert values into the 'inventory' table
$sql = "INSERT INTO inventory (serialNo, batchID, productID, stockingDate, nextRestock, manufacturingDate, shippingCompany, shippingStatus, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssi", $serialNo, $batchID, $productID, $stockingDate, $nextRestock, $manufacturingDate, $shippingCompany, $shippingStatus, $quantity);




try {
    if ($stmt->execute()) {
        echo "Record Inserted Successfully!";
    }
}
//catch exception
catch(Exception) {
    echo 'ERROR!!! ' .$stmt->error;
}


$stmt->close();
$conn->close();
?>
