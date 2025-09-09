#!/bin/bash

echo "Starting CivicPulse Application..."
echo

echo "Installing dependencies..."
npm run install-all

echo
echo "Starting MongoDB (if not running)..."
echo "Please make sure MongoDB is running on your system"

echo
echo "Starting the application..."
npm run dev
