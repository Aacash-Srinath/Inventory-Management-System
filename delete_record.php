<?php
// Connect to your database (Replace with your connection code)
$pdo = new PDO("mysql:host=localhost:3307;dbname=ArcusInventory", "root", "");

// Retrieve data from POST request
$serialNo = $_POST['serialNo'];


// Delete the record in the database
$query = "DELETE FROM inventory 
            WHERE serialNo = :serialNo";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':serialNo', $serialNo);

if ($stmt->execute()) {
    $response = array('success' => true);
} else {
    $response = array('success' => false);
}

echo json_encode($response);
?>
