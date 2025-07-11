<?php
require 'config.php';
$data = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($data['username'] ?? '');
$password = $data['password'] ?? '';
if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}
$stmt = $conn->prepare("SELECT id, password FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($id, $hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    session_start();
    $_SESSION['user_id'] = $id;
    echo json_encode(['success' => true]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Login failed']);
}
$stmt->close();
?>
