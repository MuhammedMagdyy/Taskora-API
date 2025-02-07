-- Create table statuses
CREATE TABLE IF NOT EXISTS statuses (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table projects
CREATE TABLE IF NOT EXISTS projects (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    color VARCHAR(7) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_uuid VARCHAR(36) NOT NULL,
    FOREIGN KEY (status_uuid) REFERENCES statuses(uuid)
);

-- Create table tags
CREATE TABLE IF NOT EXISTS tags (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table tasks
CREATE TABLE IF NOT EXISTS tasks (
    uuid VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    project_uuid VARCHAR(36) NOT NULL,
    tag_uuid VARCHAR(36),
    status_uuid VARCHAR(36) NOT NULL,
    FOREIGN KEY (project_uuid) REFERENCES projects(uuid),
    FOREIGN KEY (tag_uuid) REFERENCES tags(uuid),
    FOREIGN KEY (status_uuid) REFERENCES statuses(uuid)
);

-- Insert data into statuses
INSERT INTO statuses (uuid, name, color, created_at, updated_at) VALUES
(uuid(), 'IN_PROGRESS', '#007bff', NOW(), NOW()),
(uuid(), 'DONE', '#28a745', NOW(), NOW()),
(uuid(), 'ARCHIVED', '#6c757d', NOW(), NOW());

-- Insert data into projects
INSERT INTO projects (uuid, name, description, due_date, color, status_uuid, created_at, updated_at) VALUES
(uuid(), 'Project Alpha', 'Description for Project Alpha', '2023-12-31', '#FF0000', (SELECT uuid FROM statuses WHERE name = 'IN_PROGRESS'), NOW(), NOW()),
(uuid(), 'Project Beta', 'Description for Project Beta', '2024-01-15', '#0000FF', (SELECT uuid FROM statuses WHERE name = 'IN_PROGRESS'), NOW(), NOW()),
(uuid(), 'Project Gamma', 'Description for Project Gamma', '2024-02-20', '#008000', (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Project Delta', 'Description for Project Delta', '2024-03-10', '#FFFF00', (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Project Epsilon', 'Description for Project Epsilon', '2024-04-05', '#800080', (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Project Zeta', 'Description for Project Zeta', '2024-05-15', '#FFA500', (SELECT uuid FROM statuses WHERE name = 'ARCHIVED'), NOW(), NOW()),
(uuid(), 'Project Eta', 'Description for Project Eta', '2024-06-25', '#FFC0CB', (SELECT uuid FROM statuses WHERE name = 'ARCHIVED'), NOW(), NOW());

-- Insert data into tags
INSERT INTO tags (uuid, name, color, created_at, updated_at) VALUES
(uuid(), 'Urgent', '#FF0000', NOW(), NOW()),
(uuid(), 'Optional', '#808080', NOW(), NOW()),
(uuid(), 'High Priority', '#FFA500', NOW(), NOW()),
(uuid(), 'Low Priority', '#0000FF', NOW(), NOW()),
(uuid(), 'Bug', '#000000', NOW(), NOW()),
(uuid(), 'Feature', '#008000', NOW(), NOW()),
(uuid(), 'Improvement', '#800080', NOW(), NOW());

-- Insert data into tasks
INSERT INTO tasks (uuid, name, description, due_date, project_uuid, tag_uuid, status_uuid, created_at, updated_at) VALUES
(uuid(), 'Task 1', 'Description for Task 1', '2023-11-30', (SELECT uuid FROM projects WHERE name = 'Project Alpha'), (SELECT uuid FROM tags WHERE name = 'Urgent'), (SELECT uuid FROM statuses WHERE name = 'IN_PROGRESS'), NOW(), NOW()),
(uuid(), 'Task 2', 'Description for Task 2', '2024-01-10', (SELECT uuid FROM projects WHERE name = 'Project Beta'), (SELECT uuid FROM tags WHERE name = 'Optional'), (SELECT uuid FROM statuses WHERE name = 'IN_PROGRESS'), NOW(), NOW()),
(uuid(), 'Task 3', 'Description for Task 3', '2024-02-15', (SELECT uuid FROM projects WHERE name = 'Project Gamma'), (SELECT uuid FROM tags WHERE name = 'High Priority'), (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Task 4', 'Description for Task 4', '2024-03-05', (SELECT uuid FROM projects WHERE name = 'Project Delta'), (SELECT uuid FROM tags WHERE name = 'Low Priority'), (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Task 5', 'Description for Task 5', '2024-04-01', (SELECT uuid FROM projects WHERE name = 'Project Epsilon'), (SELECT uuid FROM tags WHERE name = 'Bug'), (SELECT uuid FROM statuses WHERE name = 'DONE'), NOW(), NOW()),
(uuid(), 'Task 6', 'Description for Task 6', '2024-05-10', (SELECT uuid FROM projects WHERE name = 'Project Zeta'), (SELECT uuid FROM tags WHERE name = 'Feature'), (SELECT uuid FROM statuses WHERE name = 'ARCHIVED'), NOW(), NOW()),
(uuid(), 'Task 7', 'Description for Task 7', '2024-06-20', (SELECT uuid FROM projects WHERE name = 'Project Eta'), (SELECT uuid FROM tags WHERE name = 'Improvement'), (SELECT uuid FROM statuses WHERE name = 'ARCHIVED'), NOW(), NOW());