#!/bin/bash
# Build and deploy frontend to backend

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Copying to backend static folder..."
rm -rf ../backend/portfolio-backend/src/main/resources/static/*
cp -r dist/* ../backend/portfolio-backend/src/main/resources/static/

echo "Done! Frontend is now served by backend."
