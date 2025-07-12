<?php
// FILE: backend/register.php

// --- CORS Header Correction ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// The browser sends a "pre-flight" OPTIONS request first to check permissions.
// This block handles that request and tells the browser it's okay to proceed.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}
// --- End of Correction ---


// --- Your Original Code ---
require_once 'bootstrap.php';
require_once 'db.php';
require_once 'utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Metode tidak valid'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$email = trim($data['email'] ?? '');

if (!$username || !$password || !$email) {
    sendResponse(['error' => 'Semua field wajib diisi'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(['error' => 'Format email tidak valid'], 400);
}

// Validasi kekuatan password (minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka)
if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password)) {
    sendResponse(['error' => 'Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, dan angka.'], 400);
}


$db = getDB();
$stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    sendResponse(['error' => 'Username atau email sudah terdaftar'], 400);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $db->prepare("INSERT INTO users(username, password, email) VALUES(?, ?, ?)");
$stmt->execute([$username, $hash, $email]);

sendResponse(['success' => true], 201);
?>