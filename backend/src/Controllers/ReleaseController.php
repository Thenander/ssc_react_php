<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\ReleaseRepository;
use PDO;

class ReleaseController
{
    private ReleaseRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new ReleaseRepository($pdo);
    }

    public function index(Request $request, Response $response): Response
    {
        $releases = $this->repo->all();
        $response->getBody()->write(json_encode($releases));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $release = $this->repo->find((int) $args['id']);

        if (!$release) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $release['tracks'] = $this->repo->findTracks((int) $args['id']);

        $response->getBody()->write(json_encode($release));
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
            'title'   => trim($data['title']),
            'artist'  => isset($data['artist']) ? trim($data['artist']) : null,
            'year'    => isset($data['year']) ? (int) $data['year'] : null,
            'type_id' => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'   => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Release created', 'id' => $id]));
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
            'title'   => trim($data['title']),
            'artist'  => isset($data['artist']) ? trim($data['artist']) : null,
            'year'    => isset($data['year']) ? (int) $data['year'] : null,
            'type_id' => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'   => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Release updated']));
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
        $response->getBody()->write(json_encode(['message' => 'Release deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
