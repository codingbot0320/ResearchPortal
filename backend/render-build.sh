#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install

# Rebuild sqlite3 from source
npm rebuild sqlite3 --build-from-source --sqlite=/usr
