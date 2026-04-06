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

    public function update(Request $request, Response $response, array $args): Response
    {
        $body = (array) $request->getParsedBody();
        $type = trim($body['type'] ?? '');
        $text = trim($body['text'] ?? '');

        if ($type === '' || $text === '') {
            $response->getBody()->write(json_encode(['error' => 'type and text are required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $updated = $this->repo->update((int) $args['id'], $type, $text);
        if (!$updated) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($updated));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $deleted = $this->repo->delete((int) $args['id']);
        $response->getBody()->write(json_encode(['success' => $deleted]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $allowed = ['release', 'sample', 'source'];
        $body = (array) $request->getParsedBody();

        $category = trim($body['category'] ?? '');
        $type     = trim($body['type'] ?? '');
        $text     = trim($body['text'] ?? '');

        if (!in_array($category, $allowed) || $type === '' || $text === '') {
            $response->getBody()->write(json_encode(['error' => 'category, type and text are required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $created = $this->repo->create($category, $type, $text);
        $response->getBody()->write(json_encode($created));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
}
