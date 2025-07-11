<?php
header('Content-Type: application/json');
$symbol = $_GET['symbol'] ?? '';
if (!$symbol) { echo json_encode([]); exit; }
$url = "https://fapi.binance.com/fapi/v1/fundingRate?symbol=$symbol&limit=1";
echo file_get_contents($url);
?>
