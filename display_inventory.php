<?php
// Database connection
$conn = mysqli_connect("localhost:3307", "root", "", "ArcusInventory");
header('Content-Type: application/json; charset=utf-8');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Fetch records from the inventory table
$sql = "SELECT * FROM inventory";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

$dataset = array(
    'echo' => 1,
    'totalrecords' => count($data),
    'totaldisplayrecords' => count($data),
    'data' => $data
);

mysqli_free_result($result);
mysqli_close($conn);

echo json_encode($data, JSON_PRETTY_PRINT);
?>
