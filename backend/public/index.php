<?php

use Slim\Factory\AppFactory;
use App\Middleware\JwtMiddleware;
use App\Controllers\AuthController;
use App\Controllers\ReleaseController;
use App\Controllers\TrackController;
use App\Controllers\SourceController;
use App\Controllers\SampleController;
use App\Controllers\TypeController;

require __DIR__ . '/../vendor/autoload.php';

$pdo = require __DIR__ . '/../config/database.php';

$app = AppFactory::create();

$basePath = $_ENV['APP_BASE_PATH'] ?? '';
if ($basePath !== '') $app->setBasePath($basePath);
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

/**
 * =========================
 * CORS
 * =========================
 */
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ORIGIN'] ?? 'http://localhost:3000')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->options('/{routes:.+}', function ($request, $response) {
    return $response;
});

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

$app->get('/api/test', function ($req, $res) {
    $res->getBody()->write(json_encode(['status' => 'API up and running']));
    return $res->withHeader('Content-Type', 'application/json');
});

// Auth
$app->post('/api/auth/login', function ($req, $res) use ($pdo) {
    return (new AuthController($pdo))->login($req, $res);
});

// Types
$app->get('/api/types', function ($req, $res) use ($pdo) {
    return (new TypeController($pdo))->index($req, $res);
});
$app->get('/api/types/{category}', function ($req, $res, $args) use ($pdo) {
    return (new TypeController($pdo))->byCategory($req, $res, $args);
});

// Releases
$app->get('/api/releases', function ($req, $res) use ($pdo) {
    return (new ReleaseController($pdo))->index($req, $res);
});
$app->get('/api/releases/{id}', function ($req, $res, $args) use ($pdo) {
    return (new ReleaseController($pdo))->show($req, $res, $args);
});

// Tracks
$app->get('/api/tracks', function ($req, $res) use ($pdo) {
    return (new TrackController($pdo))->index($req, $res);
});
$app->get('/api/tracks/{id}', function ($req, $res, $args) use ($pdo) {
    return (new TrackController($pdo))->show($req, $res, $args);
});

// Sources
$app->get('/api/sources', function ($req, $res) use ($pdo) {
    return (new SourceController($pdo))->index($req, $res);
});
$app->get('/api/sources/{id}', function ($req, $res, $args) use ($pdo) {
    return (new SourceController($pdo))->show($req, $res, $args);
});

// Samples
$app->get('/api/samples', function ($req, $res) use ($pdo) {
    return (new SampleController($pdo))->index($req, $res);
});
$app->get('/api/samples/{id}', function ($req, $res, $args) use ($pdo) {
    return (new SampleController($pdo))->show($req, $res, $args);
});

/**
 * =========================
 * PROTECTED ROUTES (JWT)
 * =========================
 */
$app->group('/api', function ($group) use ($pdo) {

    // Releases
    $group->post('/releases', function ($req, $res) use ($pdo) {
        return (new ReleaseController($pdo))->create($req, $res);
    });
    $group->put('/releases/{id}', function ($req, $res, $args) use ($pdo) {
        return (new ReleaseController($pdo))->update($req, $res, $args);
    });
    $group->delete('/releases/{id}', function ($req, $res, $args) use ($pdo) {
        return (new ReleaseController($pdo))->delete($req, $res, $args);
    });

    // Tracks
    $group->post('/tracks', function ($req, $res) use ($pdo) {
        return (new TrackController($pdo))->create($req, $res);
    });
    $group->put('/tracks/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TrackController($pdo))->update($req, $res, $args);
    });
    $group->delete('/tracks/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TrackController($pdo))->delete($req, $res, $args);
    });

    // Sources
    $group->post('/sources', function ($req, $res) use ($pdo) {
        return (new SourceController($pdo))->create($req, $res);
    });
    $group->put('/sources/{id}', function ($req, $res, $args) use ($pdo) {
        return (new SourceController($pdo))->update($req, $res, $args);
    });
    $group->delete('/sources/{id}', function ($req, $res, $args) use ($pdo) {
        return (new SourceController($pdo))->delete($req, $res, $args);
    });

    // Samples
    $group->post('/samples', function ($req, $res) use ($pdo) {
        return (new SampleController($pdo))->create($req, $res);
    });
    $group->put('/samples/{id}', function ($req, $res, $args) use ($pdo) {
        return (new SampleController($pdo))->update($req, $res, $args);
    });
    $group->delete('/samples/{id}', function ($req, $res, $args) use ($pdo) {
        return (new SampleController($pdo))->delete($req, $res, $args);
    });

    // Types
    $group->post('/types', function ($req, $res) use ($pdo) {
        return (new TypeController($pdo))->create($req, $res);
    });
    $group->put('/types/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TypeController($pdo))->update($req, $res, $args);
    });
    $group->delete('/types/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TypeController($pdo))->delete($req, $res, $args);
    });

    // Koppla/ta bort sample från track
    $group->post('/samples/{id}/tracks/{track_id}', function ($req, $res, $args) use ($pdo) {
        return (new SampleController($pdo))->attachToTrack($req, $res, $args);
    });
    $group->delete('/samples/{id}/tracks/{track_id}', function ($req, $res, $args) use ($pdo) {
        return (new SampleController($pdo))->detachFromTrack($req, $res, $args);
    });

})->add(new JwtMiddleware());

$app->run();
