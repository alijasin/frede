# Frede - Bulk Certificate Search Tool

A web application that allows you to search for SSL certificates for multiple domains simultaneously using crt.sh. The tool provides a clean interface to view and export certificate data.

## Features

- Search multiple domains at once
- View results in a clean, tabulated format
- Export all results to CSV
- Filter out expired certificates
- Deduplicate results
- Dark mode interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/frede.git
cd frede
```

2. Install dependencies:
```bash
npm install
```

## Usage

You need to run both the frontend and the proxy server.

1. Start the frontend development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

2. In a new terminal, start the proxy server:
```bash
node server.js
```
The proxy server will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:5173

## How to Use

1. Enter domain names one at a time (e.g., example.com)
2. Click "Add Domain" or press Enter to add more domains
3. Click "Search Certificates" to fetch results for all domains
4. View results in the interface
5. Use "Export All to CSV" to download all results in a single CSV file

## Notes

- The tool uses crt.sh's API to fetch certificate data
- Results are filtered to exclude expired certificates
- Duplicate entries are automatically removed
- The proxy server is required to bypass CORS restrictions

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser
