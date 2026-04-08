#!/bin/bash
set -e

USER="microlab.se"
HOST="linux126.unoeuro.com"
REMOTE="public_html/cultivatedbimbo"
LOCAL="/Volumes/Blue T7/repos/ssc_react_php"

echo "Building frontend..."
cd "$LOCAL/frontend" && npm run build

echo "Uploading frontend..."
scp -r "$LOCAL/frontend/build/." $USER@$HOST:$REMOTE/

echo "Uploading backend..."
scp -r "$LOCAL/backend/src"    $USER@$HOST:$REMOTE/
scp -r "$LOCAL/backend/config" $USER@$HOST:$REMOTE/
scp    "$LOCAL/backend/public/index.php"  $USER@$HOST:$REMOTE/api/
scp    "$LOCAL/backend/public/.htaccess"  $USER@$HOST:$REMOTE/api/

echo "Done!"
