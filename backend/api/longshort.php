<?php
require_once '../auth.php';
require_once '../utils/response.php';
requireLogin();

$symbol = $_GET['symbol'] ?? '';
if (!$symbol) sendResponse(['error'=>'symbol wajib diisi'],400);
if (!preg_match('/^[A-Z0-9]{5,20}$/', $symbol)) sendResponse(['error'=>'symbol tidak valid'],400);

$binance_url = "https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=$symbol&period=5m&limit=1";
$data = file_get_contents($binance_url);
sendResponse(json_decode($data,true));
?>
