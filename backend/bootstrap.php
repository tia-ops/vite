<?php
// FILE: backend/bootstrap.php

// Mulai sesi terlebih dahulu.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Periksa apakah ini adalah sesi baru yang belum memiliki cookie yang dikonfigurasi dengan benar.
// Kita menggunakan variabel sesi untuk melacak ini.
if (empty($_SESSION['cookie_sent'])) {
    
    // Dapatkan nama cookie sesi saat ini (biasanya 'PHPSESSID')
    $cookie_name = session_name();
    
    // Dapatkan ID sesi saat ini
    $session_id = session_id();
    
    // Hapus header Set-Cookie default yang mungkin sudah dibuat oleh session_start()
    header_remove('Set-Cookie');
    
    // Buat header Set-Cookie kita sendiri dengan semua atribut yang benar
    $cookie_header = "Set-Cookie: {$cookie_name}={$session_id}; ";
    $cookie_header .= "path=/; ";
    $cookie_header .= "SameSite=None; ";
    $cookie_header .= "Secure; ";
    $cookie_header .= "HttpOnly";
    
    // Kirim header yang sudah dikonfigurasi
    header($cookie_header, false);
    
    // Tandai bahwa cookie sudah dikirim untuk sesi ini agar tidak dikirim berulang kali
    $_SESSION['cookie_sent'] = true;
}

// Load sisa konfigurasi
require_once __DIR__ . '/config.php';
?>