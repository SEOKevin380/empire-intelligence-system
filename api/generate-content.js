// API Configuration Test - /api/generate-content.js
// Test Claude API configuration step by step

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'API_TEST_MODE',
      message: 'Testing Claude API configuration'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'ANTHROPIC_API_KEY environment variable missing'
      });
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-ant-')) {
      return res.status(500).json({
        error: 'Invalid API key format',
        message: 'API key should start with sk-ant-',
        keyPrefix: apiKey.substring(0, 10) + '...'
      });
    }

    // Extract fields (flexible naming)
    const { niche, keyword, companyName, affiliateLink, modelTier = 'standard' } = req.body || {};
    
    // Basic validation
    if (!niche || !keyword || !companyName) {
      return res.status(400).json({
        error: 'Missing fields',
        received: { niche: !!niche, keyword: !!keyword, companyName: !!companyName }
      });
    }

    // Simple test request to Claude API
    console.log('Testing Claude API connection...');
    
    const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Write a brief 50-word article about test product.'
          }
        ]
      })
    });

    console.log('Claude API Response Status:', testResponse.status);
    console.log('Claude API Response Headers:', Object.fromEntries(testResponse.headers.entries()));

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('Claude API Error Details:', errorText);
      
      return res.status(500).json({
        error: 'Claude API request failed',
        status: testResponse.status,
        statusText: testResponse.statusText,
        details: errorText,
        apiKeyValid: apiKey.startsWith('sk-ant-'),
        timestamp: new Date().toISOString()
      });
    }

    const apiData = await testResponse.json();
    console.log('Claude API Success:', apiData);

    // Return success with actual generated content
    return res.status(200).json({
      success: true,
      content: apiData.content[0].text,
      qualityScore: 100,
      qualityBreakdown: {
        wordCount: apiData.content[0].text.split(' ').length,
        hasH1Title: true,
        h2Sections: 1,
        affiliateLinks: 0
      },
      metadata: {
        modelUsed: 'claude-3-5-sonnet-20241022',
        apiTest: 'successful',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Function Error:', error);
    return res.status(500).json({
      error: 'Function execution failed',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
