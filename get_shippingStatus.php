<?php
// Connect to your database 
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve Shipping Status from POST request
$shippingStatus = $_GET['shipping'];

// Query to retrieve the record
$query = "SELECT serialNo, batchId, productId, stockingDate, nextRestock, manufacturingDate, shippingCompany, quantity FROM inventory WHERE shippingStatus = :shippingStatus";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':shippingStatus', $shippingStatus);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($record) {
    $response = array('success' => true, 'record' => $record);
} else {
    $response = array('success' => false);
}

echo json_encode($record);
?>