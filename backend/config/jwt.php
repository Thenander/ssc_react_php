<?php

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

return [
    'secret' => $_ENV['JWT_SECRET'] ?? 'fallback_secret'
];
