<?php
// FILE: backend/bootstrap.php (Lengkap & Diperbaiki)

// Atur header CORS untuk mengizinkan permintaan dari frontend Anda
// Pastikan URL ini sesuai dengan URL Codespaces Anda atau gunakan '*' untuk pengembangan
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Ganti URL ini dengan URL frontend Anda di lingkungan produksi
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache untuk 1 hari
}

// Tangani preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

// --- PERBAIKAN UTAMA: KONFIGURASI SESSION COOKIE ---
// Hanya mulai sesi jika belum ada.
if (session_status() == PHP_SESSION_NONE) {
    // Atur parameter cookie SEBELUM sesi dimulai.
    session_set_cookie_params([
        'lifetime' => 0, // 0 = Cookie berlaku hingga browser ditutup
        'path' => '/',
        'domain' => '', // Kosongkan untuk development, atau isi dengan domain Anda (mis: 'sinyalrmb.net')
        'secure' => true,   // Cookie hanya akan dikirim melalui koneksi HTTPS
        'httponly' => true, // Mencegah akses cookie dari JavaScript sisi klien (melindungi dari XSS)
        'samesite' => 'None' // 'None' diperlukan agar cookie bisa dikirim pada request cross-site (mis: Codespaces ke SinyalRMB)
    ]);
    
    session_start();
}

// Muat file konfigurasi utama
require_once __DIR__ . '/config.php';
?>