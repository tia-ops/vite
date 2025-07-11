<?php
// FILE: backend/api/symbols.php
require_once '../bootstrap.php';
require_once '../auth.php';
require_once '../utils/response.php';

requireLogin();

$url = BINANCE_API_BASE_URL . "/fapi/v1/exchangeInfo";
$data = @file_get_contents($url);

if ($data === false) {
    sendResponse(['error' => 'Gagal mengambil data dari Binance API'], 502);
}

sendResponse(json_decode($data, true));
?>