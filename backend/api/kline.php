<?php
// FILE: backend/api/kline.php
require_once '../bootstrap.php';
require_once '../auth.php';
require_once '../utils/response.php';

requireLogin();

$symbol = $_GET['symbol'] ?? '';
$interval = $_GET['interval'] ?? '1m';
$limit = $_GET['limit'] ?? '100';

if (!$symbol) {
    sendResponse(['error' => 'Simbol wajib diisi'], 400);
}
if (!preg_match('/^[A-Z0-9]{5,20}$/', $symbol)) {
    sendResponse(['error' => 'Simbol tidak valid'], 400);
}
if (!preg_match('/^(1m|3m|5m|15m|30m|1h|2h|4h|6h|8h|12h|1d|3d|1w|1M)$/', $interval)) {
    sendResponse(['error' => 'Interval tidak valid'], 400);
}
if (!is_numeric($limit) || $limit < 1 || $limit > 1000) {
    sendResponse(['error' => 'Limit tidak valid'], 400);
}

$q = http_build_query(['symbol' => $symbol, 'interval' => $interval, 'limit' => $limit]);
$url = BINANCE_API_BASE_URL . "/fapi/v1/klines?$q";
$data = @file_get_contents($url);

if ($data === false) {
    sendResponse(['error' => 'Gagal mengambil data dari Binance API'], 502);
}

sendResponse(json_decode($data, true));
?>