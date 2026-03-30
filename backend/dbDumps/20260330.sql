CREATE DATABASE IF NOT EXISTS `sscdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `sscdb`;

-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: sscdb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--
DROP TABLE IF EXISTS `admins`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `admins` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `username` (`username`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `format_types`
--
DROP TABLE IF EXISTS `format_types`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `format_types` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `format_type` varchar(10) DEFAULT NULL,
        `text` varchar(255) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `releases`
--
DROP TABLE IF EXISTS `releases`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `releases` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) NOT NULL,
        `artist` varchar(255) DEFAULT NULL,
        `year` year (4) DEFAULT NULL,
        `type` varchar(20) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sample_types`
--
DROP TABLE IF EXISTS `sample_types`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `sample_types` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `sample_type` varchar(10) DEFAULT NULL,
        `text` varchar(255) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `samples`
--
DROP TABLE IF EXISTS `samples`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `samples` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `type` varchar(20) DEFAULT NULL,
        `source_id` int (11) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `source_id` (`source_id`),
        CONSTRAINT `samples_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `sources` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `source_samples_ref`
--
DROP TABLE IF EXISTS `source_samples_ref`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `source_samples_ref` (
        `source_id` int (11) NOT NULL,
        `sample_id` int (11) NOT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`source_id`, `sample_id`),
        KEY `sample_id` (`sample_id`),
        CONSTRAINT `source_samples_ref_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `sources` (`id`) ON DELETE CASCADE,
        CONSTRAINT `source_samples_ref_ibfk_2` FOREIGN KEY (`sample_id`) REFERENCES `samples` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `source_types`
--
DROP TABLE IF EXISTS `source_types`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `source_types` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `source_type` varchar(10) DEFAULT NULL,
        `text` varchar(255) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sources`
--
DROP TABLE IF EXISTS `sources`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `sources` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) NOT NULL,
        `producer` varchar(255) DEFAULT NULL,
        `type` varchar(20) DEFAULT NULL,
        `year` year (4) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `track_samples_ref`
--
DROP TABLE IF EXISTS `track_samples_ref`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `track_samples_ref` (
        `track_id` int (11) NOT NULL,
        `sample_id` int (11) NOT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`track_id`, `sample_id`),
        KEY `sample_id` (`sample_id`),
        CONSTRAINT `track_samples_ref_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE,
        CONSTRAINT `track_samples_ref_ibfk_2` FOREIGN KEY (`sample_id`) REFERENCES `samples` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tracks`
--
DROP TABLE IF EXISTS `tracks`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `tracks` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) NOT NULL,
        `type` varchar(20) DEFAULT NULL,
        `release_id` int (11) DEFAULT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `release_id` (`release_id`),
        CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`release_id`) REFERENCES `releases` (`id`) ON DELETE SET NULL
    ) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `types`
--
DROP TABLE IF EXISTS `types`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `types` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `category` enum ('track', 'sample', 'release', 'source') NOT NULL,
        `type` varchar(32) NOT NULL,
        `text` varchar(128) NOT NULL,
        `created` timestamp NOT NULL DEFAULT current_timestamp(),
        `changed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30 18:43:57