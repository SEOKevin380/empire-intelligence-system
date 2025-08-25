// Ultra Minimal Function - /api/generate-content.js
// Absolutely minimal code to test basic functionality

export default function handler(req, res) {
  // Set basic headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Return simple response
  return res.status(200).json({
    status: 'WORKING',
    message: 'Function is alive!',
    timestamp: new Date().toISOString(),
    method: req.method
  });
}
