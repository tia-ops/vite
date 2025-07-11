<?php
header('Content-Type: application/json');
$symbol = $_GET['symbol'] ?? '';
$interval = $_GET['interval'] ?? '1m';
$limit = $_GET['limit'] ?? '100';
if (!$symbol) { echo json_encode([]); exit; }
$url = "https://fapi.binance.com/fapi/v1/klines?symbol=$symbol&interval=$interval&limit=$limit";
echo file_get_contents($url);
?>
