import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

// Helper function to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return dateStr;
  }
};

app.get('/search/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const url = `https://crt.sh/?q=${encodeURIComponent(domain)}&exclude=expired&deduplicate=Y&output=json`;
    console.log('Full URL being requested:', url);
    console.log('Domain:', domain);
    console.log('Encoded domain:', encodeURIComponent(domain));
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    // Log the response details
    console.log('Response status:', response.status);
    console.log('Response type:', typeof response.data);
    console.log('Response length:', Array.isArray(response.data) ? response.data.length : 'not an array');

    // Send both the raw data and formatted HTML
    res.json({
      data: response.data,
      html: generateHtml(domain, response.data)
    });

  } catch (error) {
    console.error(`Error fetching ${req.params.domain}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate HTML
const generateHtml = (domain, data) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .url-info { 
            background: #f0f0f0; 
            padding: 10px; 
            margin-bottom: 20px; 
            border-radius: 4px; 
            font-family: monospace; 
          }
        </style>
      </head>
      <body>
        <div class="url-info">
          Search URL: <a href="https://crt.sh/?q=${encodeURIComponent(domain)}&exclude=expired&deduplicate=Y" target="_blank">
            View on crt.sh
          </a>
        </div>
        <h2>Results for ${domain}</h2>
        <table>
          <thead>
            <tr>
              <th>Common Name</th>
              <th>Name Value</th>
              <th>Issuer Name</th>
              <th>Entry Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${Array.isArray(data) ? data.map(cert => `
              <tr>
                <td>${cert.common_name || ''}</td>
                <td>${cert.name_value || ''}</td>
                <td>${cert.issuer_name || ''}</td>
                <td>${formatDate(cert.entry_timestamp) || ''}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">No results found</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 