<?php
// Database connection
$conn = mysqli_connect("localhost:3307", "root", "", "ArcusInventory");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}


if (isset($_POST['productIds']) && is_array($_POST['productIds'])) {
    $productIds = $_POST['productIds'];
    // Escape and quote the productIds
    $escapedProductIds = array_map(function($id) use ($conn) {
        return "'" . mysqli_real_escape_string($conn, $id) . "'";
    }, $productIds);

    // Create a comma-separated list of escaped productIds
    $productIdList = implode(',', $escapedProductIds);

    // Fetch records from the inventory table with matching productIds
    $sql = "SELECT * FROM inventory WHERE productId IN ($productIdList)";
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        die("Query failed: " . mysqli_error($conn));
    }

    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    mysqli_free_result($result);
} else {
    $data = array(); // No productIds provided
}

mysqli_close($conn);

echo json_encode($data);
?>
