-- ==============================================================================
-- SCRUM MEETING BOARD - DATABASE SCHEMA & SEED DATA (v2.0)
-- Database: MySQL 8.0
-- Encoding: UTF-8 (utf8mb4)
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. Drop existing tables if present
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `board_columns`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `teams`;

-- ------------------------------------------------------------------------------
-- 2. Table: teams
-- ------------------------------------------------------------------------------
CREATE TABLE `teams` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `default_timer_seconds` INT NOT NULL DEFAULT 120,
    `presentation_mode` ENUM('alphabetical', 'random') NOT NULL DEFAULT 'alphabetical',
    `use_external_board` BOOLEAN NOT NULL DEFAULT FALSE,
    `external_board_url` VARCHAR(500) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: team_members
-- ------------------------------------------------------------------------------
CREATE TABLE `team_members` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `team_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `status` ENUM('pending', 'completed', 'skipped') NOT NULL DEFAULT 'pending',
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_members_team` FOREIGN KEY (`team_id`) 
        REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: board_columns
-- ------------------------------------------------------------------------------
CREATE TABLE `board_columns` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `team_id` INT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `position` INT NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_columns_team` FOREIGN KEY (`team_id`) 
        REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: tasks
-- ------------------------------------------------------------------------------
CREATE TABLE `tasks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `column_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `assigned_member_id` INT NULL,
    `story_points` INT NOT NULL DEFAULT 0,
    `position` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tasks_column` FOREIGN KEY (`column_id`) 
        REFERENCES `board_columns` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assigned_member_id`) 
        REFERENCES `team_members` (`id`) ON DELETE SET NULL,
    INDEX `idx_column_position` (`column_id`, `position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- 1. Equipos (2 equipos de ejemplo)
INSERT INTO `teams` (`id`, `name`, `default_timer_seconds`, `presentation_mode`, `use_external_board`, `external_board_url`) VALUES
(1, 'Alpha Warriors', 120, 'alphabetical', FALSE, NULL),
(2, 'Beta Builders', 90, 'alphabetical', TRUE, 'https://jira.atlassian.net/jira/your-board');

-- 2. Miembros de Equipos (5 por equipo, ordenados)
INSERT INTO `team_members` (`id`, `team_id`, `name`, `status`, `sort_order`) VALUES
-- Equipo 1: Alpha Warriors (orden alfabético inicial)
(1, 1, 'Carlos Vega', 'pending', 1),
(2, 1, 'Elena García', 'pending', 2),
(3, 1, 'Lucas Romero', 'pending', 3),
(4, 1, 'Mateo Díaz', 'pending', 4),
(5, 1, 'Sofia Chen', 'pending', 5),

-- Equipo 2: Beta Builders (orden alfabético inicial)
(6, 2, 'Andrés Molina', 'pending', 1),
(7, 2, 'Diego Ramos', 'pending', 2),
(8, 2, 'Javier Silva', 'pending', 3),
(9, 2, 'Laura Mendoza', 'pending', 4),
(10, 2, 'Valentina Torres', 'pending', 5);

-- 3. Columnas Estándar por Equipo (To Do, In Progress, Code Review, Done)
INSERT INTO `board_columns` (`id`, `team_id`, `name`, `position`) VALUES
-- Columnas para Team 1 (Alpha Warriors)
(1, 1, 'To Do', 1),
(2, 1, 'In Progress', 2),
(3, 1, 'Code Review', 3),
(4, 1, 'Done', 4),

-- Columnas para Team 2 (Beta Builders)
(5, 2, 'To Do', 1),
(6, 2, 'In Progress', 2),
(7, 2, 'Code Review', 3),
(8, 2, 'Done', 4);

-- 4. Tareas Iniciales de Ejemplo
INSERT INTO `tasks` (`id`, `column_id`, `title`, `description`, `assigned_member_id`, `story_points`, `position`) VALUES
-- Tareas Team 1
(1, 1, 'Definir agenda para Sprint Planning', 'Revisar backlog prioritario y objetivos del próximo sprint.', 3, 3, 0),
(2, 2, 'Implementar Drag & Drop en Scrum Board', 'Desarrollar tablero interactivo con actualización fluida y persistencia.', 2, 8, 0),
(3, 3, 'Revisar sincronización de cronómetro por equipo', 'Comprobar cambio de color y avance automático de turnos.', 4, 5, 0),
(4, 4, 'Configurar esquema MySQL 8.0 en Docker', 'Verificar volumen persistente y script SQL de inicialización.', 5, 2, 0),

-- Tareas Team 2
(5, 5, 'Diseñar arquitectura de microservicios', 'Planificar desacoplamiento de servicios y contratos OpenAPI.', 6, 5, 0),
(6, 6, 'Configurar pipeline CI/CD en GitLab', 'Integrar linter, tests unitarios y build automático de contenedores.', 10, 3, 0);
