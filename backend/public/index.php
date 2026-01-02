<?php

use Slim\Factory\AppFactory;
use App\Middleware\JwtMiddleware;
use App\Controllers\AuthController;
use App\Controllers\TrackController;

require __DIR__ . '/../vendor/autoload.php';

// Skapa PDO EN gång
$pdo = require __DIR__ . '/../config/database.php';

$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

/**
 * =========================
 * ÖPPNA ROUTES
 * =========================
 */

$app->get('/api/test', function ($req, $res) {
    $res->getBody()->write(json_encode(['status' => 'API up and running']));
    return $res->withHeader('Content-Type', 'application/json');
});

$app->get('/api/tracks', function ($req, $res) use ($pdo) {
    return (new TrackController($pdo))->index($req, $res);
});

$app->get('/api/tracks/{id}', function ($req, $res, $args) use ($pdo) {
    return (new TrackController($pdo))->show($req, $res, $args);
});

$app->post('/api/auth/login', function ($req, $res) use ($pdo) {
    return (new AuthController($pdo))->login($req, $res);
});

/**
 * =========================
 * SKYDDADE ROUTES (JWT)
 * =========================
 */
$app->group('/api', function ($group) use ($pdo) {

    $group->post('/tracks', function ($req, $res) use ($pdo) {
        return (new TrackController($pdo))->create($req, $res);
    });

    // redo för framtiden:
    /*
    $group->put('/tracks/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TrackController($pdo))->update($req, $res, $args);
    });

    $group->delete('/tracks/{id}', function ($req, $res, $args) use ($pdo) {
        return (new TrackController($pdo))->delete($req, $res, $args);
    });
    */
})->add(new JwtMiddleware());

/**
 * =========================
 * CORS
 * =========================
 */
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->options('/{routes:.+}', function ($request, $response) {
    return $response;
});

$app->run();
