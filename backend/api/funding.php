<?php
// FILE: backend/api/funding.php
require_once '../bootstrap.php';
require_once '../auth.php';
require_once '../utils/response.php';

requireLogin();

$symbol = $_GET['symbol'] ?? '';
if (!$symbol) {
    sendResponse(['error' => 'Simbol wajib diisi'], 400);
}
if (!preg_match('/^[A-Z0-9]{5,20}$/', $symbol)) {
    sendResponse(['error' => 'Simbol tidak valid'], 400);
}

$url = BINANCE_API_BASE_URL . "/fapi/v1/fundingRate?symbol=$symbol&limit=1";
$data = @file_get_contents($url);

if ($data === false) {
    sendResponse(['error' => 'Gagal mengambil data dari Binance API'], 502);
}

sendResponse(json_decode($data, true));
?>