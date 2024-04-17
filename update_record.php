<?php
// Connect to your database (Replace with your connection code)
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve data from POST request
$serialNo = $_POST['serialNo'];
$batchId = $_POST['batchId'];
$productId = $_POST['productId'];
$stockingDate = $_POST['stockingDate'];
$nextRestock = $_POST['nextRestock'];
$manufacturingDate = $_POST['manufacturingDate'];
$shippingCompany = $_POST['shippingCompany'];
$shippingStatus = $_POST['shippingStatus'];
$quantity = $_POST['quantity'];

// Update the record in the database
$query = "UPDATE inventory 
          SET batchId = :batchId, 
              productId = :productId, 
              stockingDate = :stockingDate, 
              nextRestock = :nextRestock, 
              manufacturingDate = :manufacturingDate, 
              shippingCompany = :shippingCompany, 
              shippingStatus = :shippingStatus, 
              quantity = :quantity 
          WHERE serialNo = :serialNo";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':serialNo', $serialNo);
$stmt->bindParam(':batchId', $batchId);
$stmt->bindParam(':productId', $productId);
$stmt->bindParam(':stockingDate', $stockingDate);
$stmt->bindParam(':nextRestock', $nextRestock);
$stmt->bindParam(':manufacturingDate', $manufacturingDate);
$stmt->bindParam(':shippingCompany', $shippingCompany);
$stmt->bindParam(':shippingStatus', $shippingStatus);
$stmt->bindParam(':quantity', $quantity);

if ($stmt->execute()) {
    $response = array('success' => true);
} else {
    $response = array('success' => false);
}

echo json_encode($response);
?>
