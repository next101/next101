#!/bin/sh
set -eu

echo 'Waiting for Postgres...'
node docker/wait-for-db.mjs

echo 'Running Payload migrations...'
./node_modules/.bin/payload migrate

echo 'Running Better Auth migrations...'
./node_modules/.bin/auth migrate --config src/lib/server/auth.ts --yes

echo 'Starting Next.js...'
exec ./node_modules/.bin/next start
