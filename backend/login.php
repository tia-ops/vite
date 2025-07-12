<?php
// FILE: backend/login.php (Lengkap & Diperbaiki)

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils/response.php';

// Pastikan hanya metode POST yang diterima
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Metode tidak diizinkan'], 405);
}

// Ambil data JSON dari body request
$data = json_decode(file_get_contents('php://input'), true);

// Validasi input
if (!isset($data['username']) || !isset($data['password'])) {
    sendResponse(['error' => 'Username dan password diperlukan'], 400);
}

$username = $data['username'];
$password = $data['password'];

try {
    $db = getDB();
    // Cari user berdasarkan username
    $stmt = $db->prepare('SELECT id, username, password, role FROM users WHERE username = :username');
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifikasi user dan password
    if (!$user || !password_verify($password, $user['password'])) {
        sendResponse(['error' => 'Username atau password salah'], 401);
    }

    // --- PERBAIKAN KEAMANAN ---
    // Buat ulang session ID untuk mencegah session fixation attack.
    session_regenerate_id(true);

    // Simpan user ID dan role ke dalam session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    // Kirim respons sukses
    sendResponse([
        'success' => true,
        'role' => $user['role']
    ]);

} catch (PDOException $e) {
    // Tangani error database
    // Di produksi, log error ini alih-alih menampilkannya ke user
    sendResponse(['error' => 'Terjadi masalah pada server'], 500);
}
?>