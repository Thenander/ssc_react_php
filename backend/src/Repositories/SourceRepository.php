<?php

namespace App\Repositories;

use PDO;

class SourceRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(): array
    {
        $stmt = $this->db->query("
            SELECT s.*, t.text AS type_text
            FROM sources s
            LEFT JOIN types t ON s.type_id = t.id
            ORDER BY s.title
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT s.*, t.text AS type_text
            FROM sources s
            LEFT JOIN types t ON s.type_id = t.id
            WHERE s.id = ?
        ");
        $stmt->execute([$id]);
        $source = $stmt->fetch(PDO::FETCH_ASSOC);
        return $source ?: null;
    }

    public function findSamples(int $id): array
    {
        $stmt = $this->db->prepare("
            SELECT sa.id, sa.name, sa.notes, t.text AS type_text
            FROM samples sa
            LEFT JOIN types t ON sa.type_id = t.id
            WHERE sa.source_id = ?
            ORDER BY sa.name
        ");
        $stmt->execute([$id]);
        $samples = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($samples as &$sample) {
            $trackStmt = $this->db->prepare("
                SELECT tr.id, tr.title, r.id AS release_id, r.title AS release_title, r.artist
                FROM track_samples_ref tsr
                JOIN tracks tr ON tsr.track_id = tr.id
                LEFT JOIN releases r ON tr.release_id = r.id
                WHERE tsr.sample_id = ?
                ORDER BY tr.title
            ");
            $trackStmt->execute([$sample['id']]);
            $sample['tracks'] = $trackStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return $samples;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO sources (title, producer, year, type_id, notes)
            VALUES (:title, :producer, :year, :type_id, :notes)
        ");
        $stmt->execute([
            'title'    => $data['title'],
            'producer' => $data['producer'] ?? null,
            'year'     => $data['year'] ?? null,
            'type_id'  => $data['type_id'] ?? null,
            'notes'    => $data['notes'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("
            UPDATE sources
            SET title = :title, producer = :producer, year = :year, type_id = :type_id, notes = :notes
            WHERE id = :id
        ");
        return $stmt->execute([
            'title'    => $data['title'],
            'producer' => $data['producer'] ?? null,
            'year'     => $data['year'] ?? null,
            'type_id'  => $data['type_id'] ?? null,
            'notes'    => $data['notes'] ?? null,
            'id'       => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM sources WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
