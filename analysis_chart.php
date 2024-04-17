<?php
// Database connection
$conn = mysqli_connect("localhost:3307", "root", "", "ArcusInventory");
header('Content-Type: application/json; charset=utf-8');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
header('Content-Type: application/json; charset=utf-8');

// Query to get number of products for each shipping status in the inventory table
$sql = "SELECT shippingStatus, COUNT(shippingStatus) as Count from inventory GROUP BY shippingStatus";
$result = mysqli_query($conn, $sql);

// Checking if data present after executing the query
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
$data[] = $row;
}

// Echoing the output in a JSON format
echo json_encode($data, JSON_PRETTY_PRINT);

?>


