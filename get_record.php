<?php
// Connect to your database (Replace with your connection code)
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve serial number from POST request
$serialNo = $_POST['serialNo'];

// Query to retrieve the record
$query = "SELECT * FROM inventory WHERE serialNo = :serialNo";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':serialNo', $serialNo);
$stmt->execute();
$record = $stmt->fetch(PDO::FETCH_ASSOC);

if ($record) {
    $response = array('success' => true, 'record' => $record);
} else {
    $response = array('success' => false);
}

echo json_encode($response);
?>
