<?php
// FILE: backend/register.php
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