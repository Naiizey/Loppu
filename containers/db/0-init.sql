CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS characters_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    story_id INT NOT NULL,
    base_stats JSONB NOT NULL,
    base_stuff JSONB NOT NULL,
    FOREIGN KEY (story_id) REFERENCES stories(id)
);
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    stats JSONB NOT NULL,
    character_model_id INT NOT NULL,
    stuff JSONB NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (character_model_id) REFERENCES characters_models(id)
);
CREATE TABLE IF NOT EXISTS type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    id_book_section SERIAL,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    image VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    story_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES type(id),
    FOREIGN KEY (story_id) REFERENCES stories(id)
);
CREATE TABLE IF NOT EXISTS paths (
    id SERIAL PRIMARY KEY,
    id_character SERIAL,
    id_sections SERIAL,
    FOREIGN KEY (id_character) REFERENCES characters(id),
    FOREIGN KEY (id_sections) REFERENCES sections(id)
);
CREATE TABLE IF NOT EXISTS choices (
    id_story SERIAL,
    id_section_from SERIAL,
    id_section_to SERIAL,
    content TEXT NOT NULL,
    impact JSONB NOT NULL,
    victory boolean,
    lose boolean,
    parent_key VARCHAR(255) NOT NULL,
    PRIMARY KEY (
        id_story,
        id_section_from,
        id_section_to,
        impact,
        victory,
        lose,
        parent_key
    )
);
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS stories_tags (
    id_story SERIAL,
    id_tag SERIAL,
    PRIMARY KEY (id_story, id_tag),
    FOREIGN KEY (id_story) REFERENCES stories(id),
    FOREIGN KEY (id_tag) REFERENCES tags(id)
);
CREATE TABLE IF NOT EXISTS stuff (
    id SERIAL PRIMARY KEY,
    id_story SERIAL,
    id_item SERIAL,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    stats JSONB,
    loot_points INT,
    food_points INT,
    heal_points INT,
    FOREIGN KEY (id_story) REFERENCES stories(id)
);