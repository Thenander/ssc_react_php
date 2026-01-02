<?php

namespace App\Controllers;

use PDO;
use Firebase\JWT\JWT;
use Slim\Psr7\Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    private PDO $db;
    private string $secret;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->secret = $_ENV['JWT_SECRET'];
    }

    public function login(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();

        $stmt = $this->db->prepare(
            "SELECT * FROM admins WHERE username = :username"
        );
        $stmt->execute(['username' => $data['username'] ?? '']);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$admin || !password_verify($data['password'] ?? '', $admin['password'])) {
            return $this->unauthorized($response);
        }

        $payload = [
            'sub' => $admin['id'],
            'username' => $admin['username'],
            'iat' => time(),
            'exp' => time() + 60 * 60 * 24
        ];

        $token = JWT::encode($payload, $this->secret, 'HS256');

        $response->getBody()->write(json_encode([
            'token' => $token
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    private function unauthorized(Response $response): Response
    {
        $response->getBody()->write(json_encode([
            'error' => 'Invalid credentials'
        ]));

        return $response
            ->withStatus(401)
            ->withHeader('Content-Type', 'application/json');
    }
}
