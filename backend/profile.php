<?php
// FILE: backend/profile.php

// --- Perbaikan CORS Dimulai ---
header("Access-Control-Allow-Origin: *");
// Metode GET karena hanya mengambil data
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Menangani pre-flight request dari browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}
// --- Perbaikan CORS Selesai ---


// --- Kode Asli Anda ---
require_once 'bootstrap.php';
require_once 'auth.php';
require_once 'utils/response.php';

requireLogin();

$user = getUser();
sendResponse($user);
?>