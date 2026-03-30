<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\SampleRepository;
use PDO;

class SampleController
{
    private SampleRepository $repo;

    public function __construct(PDO $pdo)
    {
        $this->repo = new SampleRepository($pdo);
    }

    public function index(Request $request, Response $response): Response
    {
        $samples = $this->repo->all();
        $response->getBody()->write(json_encode($samples));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $sample = $this->repo->find((int) $args['id']);

        if (!$sample) {
            $response->getBody()->write(json_encode(['error' => 'Not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $sample['tracks'] = $this->repo->findTracks((int) $args['id']);

        $response->getBody()->write(json_encode($sample));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();

        if (empty($data['name'])) {
            $response->getBody()->write(json_encode(['error' => 'Name is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $id = $this->repo->create([
            'name'      => trim($data['name']),
            'source_id' => isset($data['source_id']) ? (int) $data['source_id'] : null,
            'type_id'   => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'     => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Sample created', 'id' => $id]));
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

        if (empty($data['name'])) {
            $response->getBody()->write(json_encode(['error' => 'Name is required']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $this->repo->update($id, [
            'name'      => trim($data['name']),
            'source_id' => isset($data['source_id']) ? (int) $data['source_id'] : null,
            'type_id'   => isset($data['type_id']) ? (int) $data['type_id'] : null,
            'notes'     => isset($data['notes']) ? trim($data['notes']) : null,
        ]);

        $response->getBody()->write(json_encode(['message' => 'Sample updated']));
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
        $response->getBody()->write(json_encode(['message' => 'Sample deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function attachToTrack(Request $request, Response $response, array $args): Response
    {
        $this->repo->attachToTrack((int) $args['id'], (int) $args['track_id']);
        $response->getBody()->write(json_encode(['message' => 'Sample attached to track']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function detachFromTrack(Request $request, Response $response, array $args): Response
    {
        $this->repo->detachFromTrack((int) $args['id'], (int) $args['track_id']);
        $response->getBody()->write(json_encode(['message' => 'Sample detached from track']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
