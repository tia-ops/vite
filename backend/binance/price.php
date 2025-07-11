<?php
header('Content-Type: application/json');
$symbol = $_GET['symbol'] ?? '';
if (!$symbol) { echo json_encode([]); exit; }
$url = "https://fapi.binance.com/fapi/v1/ticker/price?symbol=$symbol";
echo file_get_contents($url);
?>
