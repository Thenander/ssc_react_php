<?php

namespace App\Repositories;

use PDO;

class SampleRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(): array
    {
        $stmt = $this->db->query("
            SELECT sa.*, t.text AS type_text, so.title AS source_title
            FROM samples sa
            LEFT JOIN types t ON sa.type_id = t.id
            LEFT JOIN sources so ON sa.source_id = so.id
            ORDER BY sa.name
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT sa.*, t.text AS type_text, so.title AS source_title
            FROM samples sa
            LEFT JOIN types t ON sa.type_id = t.id
            LEFT JOIN sources so ON sa.source_id = so.id
            WHERE sa.id = ?
        ");
        $stmt->execute([$id]);
        $sample = $stmt->fetch(PDO::FETCH_ASSOC);
        return $sample ?: null;
    }

    public function findTracks(int $id): array
    {
        $stmt = $this->db->prepare("
            SELECT tr.id, tr.title, r.id AS release_id, r.title AS release_title, r.artist
            FROM track_samples_ref tsr
            JOIN tracks tr ON tsr.track_id = tr.id
            LEFT JOIN releases r ON tr.release_id = r.id
            WHERE tsr.sample_id = ?
            ORDER BY tr.title
        ");
        $stmt->execute([$id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO samples (name, source_id, type_id, notes)
            VALUES (:name, :source_id, :type_id, :notes)
        ");
        $stmt->execute([
            'name'      => $data['name'],
            'source_id' => $data['source_id'] ?? null,
            'type_id'   => $data['type_id'] ?? null,
            'notes'     => $data['notes'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE samples
            SET name = :name, source_id = :source_id, type_id = :type_id, notes = :notes
            WHERE id = :id
        ");
        return $stmt->execute([
            'name'      => $data['name'],
            'source_id' => $data['source_id'] ?? null,
            'type_id'   => $data['type_id'] ?? null,
            'notes'     => $data['notes'] ?? null,
            'id'        => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM samples WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function attachToTrack(int $sampleId, int $trackId): void
    {
        $stmt = $this->db->prepare("
            INSERT IGNORE INTO track_samples_ref (track_id, sample_id)
            VALUES (:track_id, :sample_id)
        ");
        $stmt->execute(['track_id' => $trackId, 'sample_id' => $sampleId]);
    }

    public function detachFromTrack(int $sampleId, int $trackId): void
    {
        $stmt = $this->db->prepare("
            DELETE FROM track_samples_ref WHERE track_id = ? AND sample_id = ?
        ");
        $stmt->execute([$trackId, $sampleId]);
    }
}
