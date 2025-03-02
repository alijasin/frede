import { useState } from 'react'
import './App.css'

interface CertificateResult {
  domain: string
  loading: boolean
  error?: string
  html?: string
  data?: any[] // Store the raw data for export
}

function App() {
  const [domains, setDomains] = useState<string[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [results, setResults] = useState<CertificateResult[]>([])

  const addDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain])
      setNewDomain('')
    }
  }

  const removeDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain))
    setResults(results.filter(r => r.domain !== domain))
  }

  const clearAll = () => {
    setDomains([])
    setResults([])
    setNewDomain('')
  }

  const exportAllToCSV = () => {
    // Combine all results
    const allData = results.flatMap(result => {
      if (result.data) {
        return result.data.map(item => ({
          domain: result.domain,
          ...item
        }))
      }
      return []
    })

    // Create CSV content
    const headers = ['Domain', 'Common Name', 'Name Value', 'Issuer Name', 'Entry Timestamp']
    const csvContent = [
      headers.join(','),
      ...allData.map(row => [
        row.domain,
        row.common_name || '',
        row.name_value || '',
        row.issuer_name || '',
        row.entry_timestamp || ''
      ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const date = new Date().toISOString().split('T')[0]
    link.download = `certificate_search_${date}.csv`
    link.click()
  }

  const searchCertificates = async () => {
    // Reset results
    setResults(domains.map(domain => ({ domain, loading: true })))

    // Fetch results for each domain
    const promises = domains.map(async (domain, index) => {
      console.log(`Fetching certificates for ${domain}...`)
      try {
        const response = await fetch(`http://localhost:3000/search/${encodeURIComponent(domain)}`)
        
        console.log(`Response status for ${domain}:`, response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        
        const responseData = await response.json()
        console.log(`Received data for ${domain}, length:`, 
          Array.isArray(responseData.data) ? responseData.data.length : 'not an array')
        
        setResults(prev => {
          const newResults = [...prev]
          newResults[index] = { 
            domain, 
            loading: false, 
            data: responseData.data,
            html: responseData.html
          }
          return newResults
        })
      } catch (error) {
        console.error(`Error fetching ${domain}:`, error)
        setResults(prev => {
          const newResults = [...prev]
          newResults[index] = { 
            domain, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch results'
          }
          return newResults
        })
      }
    })

    try {
      await Promise.all(promises)
      console.log('All certificate searches completed')
    } catch (error) {
      console.error('Error in Promise.all:', error)
    }
  }

  const generateHtml = (domain: string, data: any[]) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
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
                  <td>${cert.entry_timestamp || ''}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">No results found</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  return (
    <div className="container">
      <h1>Bulk Certificate Search</h1>
      
      <div className="input-section">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="Enter domain (e.g., example.com)"
          onKeyPress={(e) => e.key === 'Enter' && addDomain()}
        />
        <button onClick={addDomain}>Add Domain</button>
        {domains.length > 0 && (
          <>
            <button onClick={clearAll} className="clear-btn">Clear All</button>
            <button onClick={exportAllToCSV} className="export-btn">Export All to CSV</button>
          </>
        )}
      </div>

      <div className="domains-list">
        {domains.map(domain => (
          <div key={domain} className="domain-item">
            <span>{domain}</span>
            <button onClick={() => removeDomain(domain)} className="remove-btn">×</button>
          </div>
        ))}
      </div>

      {domains.length > 0 && (
        <button onClick={searchCertificates} className="search-btn">
          Search Certificates
        </button>
      )}

      <div className="results-section">
        {results.map(result => (
          <div key={result.domain} className="result-item">
            <h3>{result.domain}</h3>
            {result.loading ? (
              <div className="loading">Searching certificates...</div>
            ) : result.error ? (
              <div className="error">{result.error}</div>
            ) : (
              <iframe
                srcDoc={result.html}
                title={`Results for ${result.domain}`}
                className="result-frame"
                sandbox="allow-same-origin allow-scripts"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
