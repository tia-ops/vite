<?php
require_once '../cors.php';
require_once '../auth.php';
require_once '../utils/response.php';
requireLogin();
$symbol = $_GET['symbol'] ?? '';
if (!$symbol) sendResponse(['error'=>'symbol wajib diisi'],400);
if (!preg_match('/^[A-Z0-9]{5,20}$/', $symbol)) sendResponse(['error'=>'symbol tidak valid'],400);
$data = file_get_contents("https://fapi.binance.com/fapi/v1/fundingRate?symbol=$symbol&limit=1");
sendResponse(json_decode($data,true));
?>
