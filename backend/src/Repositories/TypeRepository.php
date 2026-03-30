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
}
