<?php
// Connect to your database 
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve Shipping Status from POST request
$shippingCompany = $_GET['name'];

// Query to retrieve the record
$query = "SELECT serialNo, batchId, productId, stockingDate, nextRestock, manufacturingDate, shippingStatus, quantity FROM inventory WHERE shippingCompany = :shippingCompany";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':shippingCompany', $shippingCompany);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($record) {
    $response = array('success' => true, 'record' => $record);
} else {
    $response = array('success' => false);
}

echo json_encode($record);
?>