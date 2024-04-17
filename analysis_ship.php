<?php
// Database connection
$conn = mysqli_connect("localhost:3307", "root", "", "ArcusInventory");
header('Content-Type: application/json; charset=utf-8');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
header('Content-Type: application/json; charset=utf-8');

// Fetching Name & Number of Products being delivered by each Shipping Company
$sql = "SELECT shippingCompany, COUNT(shippingCompany) as Count from inventory GROUP BY shippingCompany";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
$data[] = $row;
}

// Echoing data in JSON format
echo json_encode($data, JSON_PRETTY_PRINT);

?>


