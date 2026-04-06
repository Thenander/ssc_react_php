<?php

namespace App\Repositories;

use PDO;

class TypeRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(): array
    {
        $stmt = $this->db->query("SELECT * FROM types ORDER BY category, text");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function byCategory(string $category): array
    {
        $stmt = $this->db->prepare("SELECT * FROM types WHERE category = ? ORDER BY text");
        $stmt->execute([$category]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM types WHERE id = ?");
        $stmt->execute([$id]);
        $type = $stmt->fetch(PDO::FETCH_ASSOC);
        return $type ?: null;
    }

    public function create(string $category, string $type, string $text): array
    {
        $stmt = $this->db->prepare(
            "INSERT INTO types (category, type, text, created, changed) VALUES (?, ?, ?, NOW(), NOW())"
        );
        $stmt->execute([$category, $type, $text]);
        return $this->find((int) $this->db->lastInsertId());
    }

    public function update(int $id, string $type, string $text): ?array
    {
        $stmt = $this->db->prepare(
            "UPDATE types SET type = ?, text = ?, changed = NOW() WHERE id = ?"
        );
        $stmt->execute([$type, $text, $id]);
        return $this->find($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM types WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
