<?php
// FILE: backend/utils/response.php
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
?>