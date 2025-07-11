<?php
$host = 'localhost';
$db = 'sinz3385_trader_app';    // nama database yang benar, cek di cPanel
$user = 'sinz3385_alazca';      // user database yang benar, cek di cPanel
$pass = 'Koplak450';            // password database sesuai waktu membuat user
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo $conn->connect_error;
    exit;
}
header('Content-Type: application/json');
?>
