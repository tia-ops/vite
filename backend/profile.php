<?php
require 'auth.php';
$id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT username, email, created_at FROM users WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($username, $email, $created);
if ($stmt->fetch()) {
    echo json_encode(['username' => $username, 'email' => $email, 'created_at' => $created]);
} else {
    http_response_code(404);
}
$stmt->close();
?>
