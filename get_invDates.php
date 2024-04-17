<?php
// Connect to your database 
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve from GET request
$date = $_GET['date'];
$status = $_GET['invStatus'];

// Query to retrieve the record(s)
if ($status == "Manufactured") {
    $query = "SELECT * FROM inventory WHERE DATE_FORMAT(manufacturingDate, '%Y-%m') = :dates";
} elseif ($status == "Restock") {
    $query = "SELECT * FROM inventory WHERE DATE_FORMAT(nextRestock, '%Y-%m') = :dates";
} elseif ($status == "Stocked") {
    $query = "SELECT * FROM inventory WHERE DATE_FORMAT(stockingDate, '%Y-%m') = :dates";
}


$stmt = $pdo->prepare($query);
$stmt->bindParam(':dates', $date);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($record) {
    $response = array('success' => true, 'record' => $record);
} else {
    $response = array('success' => false);
}

echo json_encode($record);
?>