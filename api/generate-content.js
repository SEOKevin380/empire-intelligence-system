// POST Request Diagnostic Function - /api/generate-content.js
// Debug 400 errors on content generation requests

export default async function handler(req, res) {
  console.log('=== REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    return res.status(200).end();
  }

  // GET endpoint (working)
  if (req.method === 'GET') {
    console.log('GET request - returning health check');
    return res.status(200).json({
      status: 'WORKING',
      message: 'API is online',
      timestamp: new Date().toISOString()
    });
  }

  // Detailed POST debugging
  if (req.method === 'POST') {
    console.log('=== POST REQUEST DEBUG ===');
    
    try {
      console.log('Raw body type:', typeof req.body);
      console.log('Raw body:', req.body);
      console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
      
      // Check Content-Type
      const contentType = req.headers['content-type'];
      console.log('Content-Type:', contentType);
      
      // Extract fields
      const { niche, product, keywords, modelTier } = req.body || {};
      
      console.log('Extracted fields:');
      console.log('- niche:', niche);
      console.log('- product:', product);
      console.log('- keywords:', keywords);
      console.log('- modelTier:', modelTier);
      
      // Validation check
      const missing = [];
      if (!niche) missing.push('niche');
      if (!product) missing.push('product');
      if (!keywords) missing.push('keywords');
      
      console.log('Missing fields:', missing);
      
      if (missing.length > 0) {
        console.log('Returning 400 - missing fields');
        return res.status(400).json({
          error: 'Missing required fields',
          missing,
          received: { niche, product, keywords, modelTier },
          debug: {
            bodyType: typeof req.body,
            bodyKeys: req.body ? Object.keys(req.body) : [],
            contentType: req.headers['content-type']
          }
        });
      }
      
      // Check API key
      const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
      console.log('API key available:', hasApiKey);
      
      if (!hasApiKey) {
        console.log('Returning 500 - no API key');
        return res.status(500).json({
          error: 'API key not configured',
          debug: 'ANTHROPIC_API_KEY environment variable missing'
        });
      }
      
      // Simple success response (no Claude API call yet)
      console.log('All validations passed - returning success');
      return res.status(200).json({
        status: 'POST_SUCCESS',
        message: 'Request received and validated successfully',
        receivedData: { niche, product, keywords, modelTier },
        debug: {
          bodyParsed: true,
          fieldsValid: true,
          apiKeyAvailable: hasApiKey,
          contentType: req.headers['content-type']
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('=== POST ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      return res.status(500).json({
        error: 'POST request processing failed',
        message: error.message,
        debug: {
          errorType: error.constructor.name,
          bodyType: typeof req.body,
          hasBody: !!req.body
        },
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Method not allowed
  console.log('Method not allowed:', req.method);
  return res.status(405).json({
    error: 'Method not allowed',
    method: req.method,
    allowed: ['GET', 'POST', 'OPTIONS']
  });
}
