<?php
// Database connection
$conn = mysqli_connect("localhost:3307", "root", "", "ArcusInventory");
header('Content-Type: application/json; charset=utf-8');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
header('Content-Type: application/json; charset=utf-8');
$max = 0;

// Fetching number of products being stocked for each month
$sql = "WITH MonthYearCTE AS (
    SELECT DISTINCT DATE_FORMAT(monthYear, '%Y-%m') AS monthYear
    FROM (
        SELECT manufacturingDate AS monthYear FROM inventory
        UNION ALL
        SELECT nextRestock FROM inventory
        UNION ALL
        SELECT stockingDate FROM inventory
    ) AS AllDates
)
SELECT m.MonthYear, IFNULL(COUNT(i.productId), 0) AS count
FROM MonthYearCTE m
LEFT JOIN inventory i ON DATE_FORMAT(i.stockingDate, '%Y-%m') = m.MonthYear
GROUP BY m.MonthYear
ORDER BY m.MonthYear";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data1 = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data1[] = $row;
}


// Fetching number of products being restocked for each month
$sql = "WITH MonthYearCTE AS (
    SELECT DISTINCT DATE_FORMAT(monthYear, '%Y-%m') AS monthYear
    FROM (
        SELECT manufacturingDate AS monthYear FROM inventory
        UNION ALL
        SELECT nextRestock FROM inventory
        UNION ALL
        SELECT stockingDate FROM inventory
    ) AS AllDates
)
SELECT m.MonthYear, IFNULL(COUNT(i.productId), 0) AS count
FROM MonthYearCTE m
LEFT JOIN inventory i ON DATE_FORMAT(i.nextRestock, '%Y-%m') = m.MonthYear
GROUP BY m.MonthYear
ORDER BY m.MonthYear";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data2 = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data2[] = $row;
}


// Fetching number of products being manufactured for each month
$sql = "WITH MonthYearCTE AS (
    SELECT DISTINCT DATE_FORMAT(monthYear, '%Y-%m') AS monthYear
    FROM (
        SELECT manufacturingDate AS monthYear FROM inventory
        UNION ALL
        SELECT nextRestock FROM inventory
        UNION ALL
        SELECT stockingDate FROM inventory
    ) AS AllDates
)
SELECT m.MonthYear, IFNULL(COUNT(i.productId), 0) AS count
FROM MonthYearCTE m
LEFT JOIN inventory i ON DATE_FORMAT(i.manufacturingDate, '%Y-%m') = m.MonthYear
GROUP BY m.MonthYear
ORDER BY m.MonthYear";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}
$data3 = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data3[] = $row;
}


// Creating an array of values for each category (Stocked, Restocked, Manufactured)
$res = array($data1, $data2, $data3);

// Echoing the output in JSON format
echo json_encode($res, JSON_PRETTY_PRINT);

?>