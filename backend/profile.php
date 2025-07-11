<?php
require_once 'cors.php';
require_once 'auth.php';
require_once 'utils/response.php';
requireLogin();
$user = getUser();
sendResponse(['user'=>$user]);
?>
