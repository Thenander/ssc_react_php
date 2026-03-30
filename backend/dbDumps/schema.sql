CREATE DATABASE IF NOT EXISTS `bimbodb` DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_general_ci;

USE `bimbodb`;

-- ----------------------------
-- types
-- ----------------------------
DROP TABLE IF EXISTS `types`;

CREATE TABLE
    `types` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `category` ENUM ('release', 'sample', 'source') NOT NULL,
        `type` VARCHAR(32) NOT NULL,
        `text` VARCHAR(128) NOT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `types` (`category`, `type`, `text`)
VALUES
    ('release', 'lp', 'LP'),
    ('release', 'cd', 'CD'),
    ('release', 'ep', 'EP'),
    ('release', 'single', 'Single'),
    ('release', 'cassette', 'Cassette'),
    ('sample', 'speech', 'Speech'),
    ('sample', 'drumloop', 'Drum Loop'),
    ('sample', 'melody', 'Melody'),
    ('sample', 'effect', 'Effect'),
    ('source', 'movie', 'Movie'),
    ('source', 'tv', 'TV Series'),
    ('source', 'sample_cd', 'Sample-CD'),
    ('source', 'album', 'Album');

-- ----------------------------
-- releases
-- ----------------------------
DROP TABLE IF EXISTS `releases`;

CREATE TABLE
    `releases` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `artist` VARCHAR(255) DEFAULT NULL,
        `year` YEAR (4) DEFAULT NULL,
        `type_id` INT (11) DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `type_id` (`type_id`),
        CONSTRAINT `releases_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- tracks
-- ----------------------------
DROP TABLE IF EXISTS `tracks`;

CREATE TABLE
    `tracks` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `release_id` INT (11) DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `release_id` (`release_id`),
        CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`release_id`) REFERENCES `releases` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- sources
-- ----------------------------
DROP TABLE IF EXISTS `sources`;

CREATE TABLE
    `sources` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(255) NOT NULL,
        `producer` VARCHAR(255) DEFAULT NULL,
        `year` YEAR (4) DEFAULT NULL,
        `type_id` INT (11) DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `type_id` (`type_id`),
        CONSTRAINT `sources_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- samples
-- ----------------------------
DROP TABLE IF EXISTS `samples`;

CREATE TABLE
    `samples` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(255) NOT NULL,
        `source_id` INT (11) DEFAULT NULL,
        `type_id` INT (11) DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `source_id` (`source_id`),
        KEY `type_id` (`type_id`),
        CONSTRAINT `samples_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `sources` (`id`) ON DELETE SET NULL,
        CONSTRAINT `samples_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- track_samples_ref
-- ----------------------------
DROP TABLE IF EXISTS `track_samples_ref`;

CREATE TABLE
    `track_samples_ref` (
        `track_id` INT (11) NOT NULL,
        `sample_id` INT (11) NOT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`track_id`, `sample_id`),
        KEY `sample_id` (`sample_id`),
        CONSTRAINT `track_samples_ref_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE,
        CONSTRAINT `track_samples_ref_ibfk_2` FOREIGN KEY (`sample_id`) REFERENCES `samples` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;

CREATE TABLE
    `admins` (
        `id` INT (11) NOT NULL AUTO_INCREMENT,
        `username` VARCHAR(50) NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `created` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        `changed` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `username` (`username`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;