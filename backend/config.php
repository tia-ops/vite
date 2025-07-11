<?php
// FILE: backend/config.php
$allowed_origins = [
    'https://solid-space-fishstick-4jrp59j7665rcq9q4-5173.app.github.dev',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'sinz3385_trader_app');
define('DB_USER', 'sinz3385_alazca');
define('DB_PASS', 'Koplak450');

define('BINANCE_API_BASE_URL', 'https://fapi.binance.com');

header('Content-Type: application/json');
?>