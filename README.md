# Frede - Bulk Certificate Search Tool

A web application that allows you to search for SSL certificates for multiple domains simultaneously using crt.sh. The tool provides a clean interface to view and export certificate data.

## Features

- Search multiple domains at once
- View results in a clean, tabulated format
- Export all results to CSV
- Filter out expired certificates
- Deduplicate results
- Dark mode interface

## Installation (Windows)

1. Install Node.js:
   - Download Node.js from https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - Run the installer and follow the installation steps
   - Make sure to check "Automatically install the necessary tools" during installation

2. Clone the repository:
   - Install Git from https://git-scm.com/download/win if you haven't already
   - Open Command Prompt (cmd) or PowerShell:
     - Press Win + R
     - Type "cmd" and press Enter
   ```cmd
   git clone https://github.com/yourusername/frede.git
   cd frede
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

## Usage (Windows)

You need two Command Prompt windows - one for the frontend and one for the proxy server.

1. Start the frontend (First Command Prompt):
   ```cmd
   npm run dev
   ```
   The frontend will be available at http://localhost:5173
   (Keep this window open)

2. Start the proxy server (Second Command Prompt):
   - Open a new Command Prompt window
   - Navigate to the project folder again:
   ```cmd
   cd path\to\frede
   node server.js
   ```
   The proxy server will run on http://localhost:3000
   (Keep this window open too)

3. Open your browser:
   - Open Chrome, Edge, or Firefox
   - Go to http://localhost:5173
   - You should see the Frede interface

## How to Use

1. Enter domain names one at a time (e.g., example.com)
2. Click "Add Domain" or press Enter to add more domains
3. Click "Search Certificates" to fetch results for all domains
4. View results in the interface
5. Use "Export All to CSV" to download all results in a single CSV file

## Troubleshooting

- If you see "command not found" for npm or node:
  - Close all Command Prompt windows
  - Restart your computer
  - Try the commands again

- If you can't access localhost:
  - Make sure your firewall isn't blocking Node.js
  - Try running Command Prompt as Administrator

- If you see CORS errors:
  - Make sure both the frontend and proxy server are running
  - Check that both Command Prompt windows show no errors

## Notes

- The tool uses crt.sh's API to fetch certificate data
- Results are filtered to exclude expired certificates
- Duplicate entries are automatically removed
- The proxy server is required to bypass CORS restrictions

## Requirements

- Windows 10 or 11
- Node.js v14 or higher (LTS version recommended)
- A modern web browser (Chrome, Edge, or Firefox)
- Git for Windows
