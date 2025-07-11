<?php
require_once '../cors.php';
require_once '../auth.php';
require_once '../utils/response.php';
requireLogin();
$symbol = $_GET['symbol'] ?? '';
$interval = $_GET['interval'] ?? '1m';
$limit = $_GET['limit'] ?? '100';
if (!$symbol) sendResponse(['error'=>'symbol wajib diisi'],400);
if (!preg_match('/^[A-Z0-9]{5,20}$/', $symbol)) sendResponse(['error'=>'symbol tidak valid'],400);
if (!preg_match('/^(1m|3m|5m|15m|30m|1h|2h|4h|6h|8h|12h|1d|3d|1w|1M)$/', $interval)) sendResponse(['error'=>'interval tidak valid'],400);
if (!is_numeric($limit) || $limit<1 || $limit>1000) sendResponse(['error'=>'limit tidak valid'],400);
$q = http_build_query(['symbol'=>$symbol,'interval'=>$interval,'limit'=>$limit]);
$data = file_get_contents("https://fapi.binance.com/fapi/v1/klines?$q");
sendResponse(json_decode($data,true));
?>
