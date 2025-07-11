<?php
$host = 'localhost';
$db = 'trader_app';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    exit;
}
header('Content-Type: application/json');
?>
