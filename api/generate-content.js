// Back to Working Version - /api/generate-content.js
// This was working before, let's build from here

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'WORKING',
      message: 'Function is alive!',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  }
  
  if (req.method === 'POST') {
    // Basic POST handling
    const { niche, product, keywords, modelTier } = req.body || {};
    
    // Simple validation
    if (!niche || !product || !keywords) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['niche', 'product', 'keywords'],
        received: { niche: !!niche, product: !!product, keywords: !!keywords }
      });
    }
    
    // Return success without Claude API for now
    return res.status(200).json({
      status: 'POST_WORKING',
      message: 'Content generation request received',
      data: { niche, product, keywords, modelTier },
      timestamp: new Date().toISOString(),
      note: 'Basic validation passed - ready for content generation'
    });
  }
  
  return res.status(405).json({
    error: 'Method not allowed',
    allowed: ['GET', 'POST'],
    received: req.method
  });
}
