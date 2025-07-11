<?php
require_once '../cors.php';
require_once '../auth.php';
require_once '../utils/response.php';
requireLogin();
$data = file_get_contents("https://fapi.binance.com/fapi/v1/exchangeInfo");
sendResponse(json_decode($data,true));
?>
