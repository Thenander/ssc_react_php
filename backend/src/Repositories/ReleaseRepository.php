<?php

namespace App\Repositories;

use PDO;

class ReleaseRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(): array
    {
        $stmt = $this->db->query("
            SELECT r.*, t.text AS type_text,
                   (SELECT COUNT(*) FROM tracks tr WHERE tr.release_id = r.id) AS track_count,
                   (SELECT COUNT(*) FROM track_samples_ref tsr JOIN tracks tr ON tsr.track_id = tr.id WHERE tr.release_id = r.id) AS sample_count
            FROM releases r
            LEFT JOIN types t ON r.type_id = t.id
            ORDER BY r.year, r.artist
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT r.*, t.text AS type_text
            FROM releases r
            LEFT JOIN types t ON r.type_id = t.id
            WHERE r.id = ?
        ");
        $stmt->execute([$id]);
        $release = $stmt->fetch(PDO::FETCH_ASSOC);
        return $release ?: null;
    }

    public function findTracks(int $id): array
    {
        $stmt = $this->db->prepare("
            SELECT t.id, t.title, t.notes,
                   (SELECT COUNT(*) FROM track_samples_ref tsr WHERE tsr.track_id = t.id) AS sample_count
            FROM tracks t
            WHERE t.release_id = ?
            ORDER BY t.id
        ");
        $stmt->execute([$id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO releases (title, artist, year, type_id, notes)
            VALUES (:title, :artist, :year, :type_id, :notes)
        ");
        $stmt->execute([
            'title'   => $data['title'],
            'artist'  => $data['artist'] ?? null,
            'year'    => $data['year'] ?? null,
            'type_id' => $data['type_id'] ?? null,
            'notes'   => $data['notes'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE releases
            SET title = :title, artist = :artist, year = :year, type_id = :type_id, notes = :notes
            WHERE id = :id
        ");
        return $stmt->execute([
            'title'   => $data['title'],
            'artist'  => $data['artist'] ?? null,
            'year'    => $data['year'] ?? null,
            'type_id' => $data['type_id'] ?? null,
            'notes'   => $data['notes'] ?? null,
            'id'      => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM releases WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
