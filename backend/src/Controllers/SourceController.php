<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\SourceRepository;
use PDO;

class SourceController
{
    private SourceRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new SourceRepository($pdo);
    }

    public function index(Request $request, Response $response): Response
    {
        $sources = $this->repo->all();
        $response->getBody()->write(json_encode($sources));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $source = $this->repo->find((int) $args['id']);

        if (!$source) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $source['samples'] = $this->repo->findSamples((int) $args['id']);

        $response->getBody()->write(json_encode($source));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();

        if (empty($data['title'])) {
            $response->getBody()->write(json_encode(['error' => 'Title is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $id = $this->repo->create([
            'title'    => trim($data['title']),
            'producer' => isset($data['producer']) ? trim($data['producer']) : null,
            'year'     => isset($data['year']) ? (int) $data['year'] : null,
            'type_id'  => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'    => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Source created', 'id' => $id]));
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        if (!$this->repo->find($id)) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        if (empty($data['title'])) {
            $response->getBody()->write(json_encode(['error' => 'Title is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $this->repo->update($id, [
            'title'    => trim($data['title']),
            'producer' => isset($data['producer']) ? trim($data['producer']) : null,
            'year'     => isset($data['year']) ? (int) $data['year'] : null,
            'type_id'  => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'    => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Source updated']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        if (!$this->repo->find($id)) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $this->repo->delete($id);
        $response->getBody()->write(json_encode(['message' => 'Source deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
