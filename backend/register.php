<?php
require 'config.php';
$data = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($data['username'] ?? '');
$password = $data['password'] ?? '';
$email = $conn->real_escape_string($data['email'] ?? '');
if (!$username || !$password || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}
$stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'User already exists']);
    exit;
}
$stmt->close();
$hashed = password_hash($password, PASSWORD_BCRYPT);
$stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $hashed, $email);
$stmt->execute();
echo json_encode(['success' => true]);
?>
