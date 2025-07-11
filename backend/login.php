<?php
// FILE: backend/login.php
require_once 'bootstrap.php';
require_once 'db.php';
require_once 'utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Metode tidak valid'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
    sendResponse(['error' => 'Username dan password wajib diisi'], 400);
}

$db = getDB();
$stmt = $db->prepare("SELECT id, password, role FROM users WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    sendResponse(['error' => 'Username atau password salah'], 401);
}

$_SESSION['user_id'] = $user['id'];
sendResponse(['success' => true, 'role' => $user['role']]);
?>