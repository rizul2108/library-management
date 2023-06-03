CREATE TABLE `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `full_name` varchar(255) NOT NULL,
    `username` varchar(255) NOT NULL,
    `salt` char(60) NOT NULL,
    `type` char(60) NOT NULL,
    `hash` char(60) NOT NULL,
    PRIMARY KEY(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE `books` (
    `book_id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `author` varchar(255) NOT NULL,
    `quantity` int NOT NULL,
    PRIMARY KEY(`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;



CREATE TABLE `requests` (
    `request_id` int NOT NULL AUTO_INCREMENT,
    `book_id` varchar(255) NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `state` enum("requested","owned") NOT NULL,
    `req_ype` enum("borrow","return","accepted");
    PRIMARY KEY(`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;