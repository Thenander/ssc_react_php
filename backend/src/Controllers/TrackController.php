<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\TrackRepository;
use PDO;

class TrackController
{
    private TrackRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new TrackRepository($pdo);
    }

    public function index(Request $request, Response $response): Response
    {
        $tracks = $this->repo->all();
        $response->getBody()->write(json_encode($tracks));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $track = $this->repo->find((int) $args['id']);

        if (!$track) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($track));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Enkel validering
        if (
            empty($data['title']) ||
            empty($data['release_id']) ||
            empty($data['type'])
        ) {
            $response->getBody()->write(json_encode([
                'error' => 'Missing required fields'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $id = $this->repo->create([
            'title' => trim($data['title']),
            'release_id' => (int) $data['release_id'],
            'type' => (int) $data['type']
        ]);

        $response->getBody()->write(json_encode([
            'message' => 'Track created',
            'id' => $id
        ]));

        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }
}
