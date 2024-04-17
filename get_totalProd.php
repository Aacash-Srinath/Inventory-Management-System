<?php
// Connect to your database 
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

$data = array();

// Query to retrieve total number of records
$query = "SELECT COUNT(*) as total from inventory";
$stmt = $pdo->prepare($query);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);
array_push($data, $record);


// Query to retrieve count of stocked products
$query = "SELECT COUNT(*) AS stocked FROM inventory WHERE stockingDate <= CURRENT_DATE";
$stmt = $pdo->prepare($query);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);
array_push($data, $record);


// Query to retrieve count of upcoming stock
$query = "SELECT COUNT(*) AS upcomingStock FROM inventory WHERE stockingDate > CURRENT_DATE";
$stmt = $pdo->prepare($query);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);
array_push($data, $record);


// Query to retrieve count of upcoming restock
$query = "SELECT COUNT(*) AS upcomingRestock FROM inventory WHERE nextRestock > CURRENT_DATE";
$stmt = $pdo->prepare($query);
$stmt->execute();
$record = $stmt->fetchAll(PDO::FETCH_ASSOC);
array_push($data, $record);



if ($data) {
    $response = array('success' => true, 'record' => $data);
} else {
    $response = array('success' => false);
}

echo json_encode($data);
?>