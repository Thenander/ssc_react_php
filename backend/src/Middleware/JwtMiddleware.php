<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtMiddleware
{
    private string $secret;

    public function __construct()
    {
        $config = require __DIR__ . '/../../config/jwt.php';
        $this->secret = $config['secret'];
    }

    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $auth = $request->getHeaderLine('Authorization');

        if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
            return $this->unauthorized();
        }

        try {
            JWT::decode($matches[1], new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return $this->unauthorized();
        }

        return $handler->handle($request);
    }

    private function unauthorized(): ResponseInterface
    {
        $response = new \Slim\Psr7\Response(401);
        $response->getBody()->write(json_encode(['error' => 'Unauthorized']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
