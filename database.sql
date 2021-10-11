DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;


--deletar as seeds
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM chefs;
DELETE FROM users;
DELETE FROM files;

--reiniciar a sequencia do auto incremento de "id" nas tabelas
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;


--criar tabela de recipes
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" integer NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now())  
);

--criar tabela chefs
CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" integer,
  "created_at" timestamp DEFAULT (now())  
);

--criar tabela files
CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);


--criar tabela recipe_files
CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" integer,
  "file_id" integer
);

--adicionar relação nas tabelas
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");


--fazer que ao deletar a receita seja deletado os files juntos
ALTER TABLE "chefs" 
DROP CONSTRAINT chefs_file_id_fkey,
ADD CONSTRAINT chefs_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;


ALTER TABLE "recipe_files" 
DROP CONSTRAINT IF EXISTS recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey 
FOREIGN KEY ("recipe_id") 
REFERENCES "recipes" ("id") 
ON DELETE CASCADE;


ALTER TABLE "recipe_files" 
DROP CONSTRAINT IF EXISTS recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey 
FOREIGN KEY ("file_id") 
REFERENCES "files" ("id") 
ON DELETE CASCADE;