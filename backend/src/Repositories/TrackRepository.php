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
        $stmt = $this->db->query("
            SELECT tr.*, r.title AS release_title, r.artist
            FROM tracks tr
            LEFT JOIN releases r ON tr.release_id = r.id
            ORDER BY r.artist, r.title, tr.id
        ");
        $tracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($tracks as &$track) {
            $track['samples'] = $this->findSamples($track['id']);
        }

        return $tracks;
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT tr.*, r.title AS release_title, r.artist
            FROM tracks tr
            LEFT JOIN releases r ON tr.release_id = r.id
            WHERE tr.id = ?
        ");
        $stmt->execute([$id]);
        $track = $stmt->fetch(PDO::FETCH_ASSOC);
        return $track ?: null;
    }

    public function findSamples(int $id): array
    {
        $stmt = $this->db->prepare("
            SELECT sa.id, sa.name, sa.notes, t.text AS type_text,
                   so.id AS source_id, so.title AS source_title, so.producer, so.year AS source_year
            FROM track_samples_ref tsr
            JOIN samples sa ON tsr.sample_id = sa.id
            LEFT JOIN types t ON sa.type_id = t.id
            LEFT JOIN sources so ON sa.source_id = so.id
            WHERE tsr.track_id = ?
            ORDER BY sa.name
        ");
        $stmt->execute([$id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO tracks (title, release_id, notes)
            VALUES (:title, :release_id, :notes)
        ");
        $stmt->execute([
            'title'      => $data['title'],
            'release_id' => $data['release_id'] ?? null,
            'notes'      => $data['notes'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE tracks
            SET title = :title, release_id = :release_id, notes = :notes
            WHERE id = :id
        ");
        return $stmt->execute([
            'title'      => $data['title'],
            'release_id' => $data['release_id'] ?? null,
            'notes'      => $data['notes'] ?? null,
            'id'         => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM tracks WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
