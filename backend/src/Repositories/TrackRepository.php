<?php

namespace App\Repositories;

use PDO;

class TrackRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(): array
    {
        $stmt = $this->db->query("SELECT * FROM tracks");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM tracks WHERE id = ?");
        $stmt->execute([$id]);
        $track = $stmt->fetch(PDO::FETCH_ASSOC);

        return $track ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO tracks (title, release_id, type)
         VALUES (:title, :release_id, :type)"
        );

        $stmt->execute([
            'title' => $data['title'],
            'release_id' => $data['release_id'],
            'type' => $data['type']
        ]);

        return (int) $this->db->lastInsertId();
    }
}
