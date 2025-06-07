# Blueprint Take Home Assessment

## Overview
React application that standardizes ad data from 3 platforms (Facebook, Twitter, Snapchat) and integrates Google Analytics results into a unified dashboard with search and sorting functionality.

## Setup
1. Install json-server: `npm install -g json-server`
2. Start JSON server: `json-server --watch db.json` (runs on port 3000)
3. Start React app: `npm start` (runs on port 3001)

## Features
- Multi-platform data standardization with consistent field mapping
- Google Analytics integration using exact and fuzzy matching
- Campaign search and spend-based sorting
- Responsive card layout with platform badges