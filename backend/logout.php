<?php
// FILE: backend/logout.php

// --- Perbaikan CORS Dimulai ---
header("Access-Control-Allow-Origin: *");
// Izinkan metode POST (jika logout dipicu via POST) atau GET, dan OPTIONS untuk pre-flight
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Menangani pre-flight request dari browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}
// --- Perbaikan CORS Selesai ---


// --- Kode Asli Anda ---
require_once 'bootstrap.php';

$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

// Menambahkan header Content-Type agar konsisten dengan file lain
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>