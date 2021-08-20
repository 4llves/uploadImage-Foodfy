DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE IF EXISTS launchstoredb;
CREATE DATABASE launchstoredb;

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "avatar_url" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" integer NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "upImage" text
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" integer UNIQUE,
  "file_id" integer UNIQUE
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");