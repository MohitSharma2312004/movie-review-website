CREATE DATABASE IF NOT EXISTS movie_review_system;
USE movie_review_system;

-- Movies Table
CREATE TABLE IF NOT EXISTS movies (
    imdb_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster_url VARCHAR(500),
    release_year VARCHAR(10)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_imdb_id VARCHAR(20),
    user_name VARCHAR(100),
    rating INT,
    comment TEXT,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_imdb_id) REFERENCES movies(imdb_id) ON DELETE CASCADE
);

-- NEW: Blogs Table (Run this part if you already have the other tables)
CREATE TABLE IF NOT EXISTS blogs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    title VARCHAR(255),
    content TEXT,
    media_url LONGTEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);