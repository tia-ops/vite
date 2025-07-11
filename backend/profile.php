<?php
// FILE: backend/profile.php
require_once 'bootstrap.php';
require_once 'auth.php';
require_once 'utils/response.php';

requireLogin();

$user = getUser();
sendResponse($user);
?>