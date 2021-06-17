#!/bin/sh

psql postgres://postgres:password@db -c "CREATE DATABASE bloom;"
psql postgres://postgres:password@db/bloom -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
yarn db:migration:run
yarn db:seed

yarn dev
