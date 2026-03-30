<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\TypeRepository;
use PDO;

class TypeController
{
    private TypeRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new TypeRepository($pdo);
    }

    public function index(Request $request, Response $response): Response
    {
        $types = $this->repo->all();
        $response->getBody()->write(json_encode($types));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function byCategory(Request $request, Response $response, array $args): Response
    {
        $allowed = ['release', 'sample', 'source'];

        if (!in_array($args['category'], $allowed)) {
            $response->getBody()->write(json_encode(['error' => 'Invalid category']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $types = $this->repo->byCategory($args['category']);
        $response->getBody()->write(json_encode($types));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
