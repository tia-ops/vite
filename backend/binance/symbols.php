<?php
header('Content-Type: application/json');
$url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
echo file_get_contents($url);
?>
