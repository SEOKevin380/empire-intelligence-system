// Detailed Logging Version - /api/generate-content.js
// Track every step to see where the 500 error occurs

export default async function handler(req, res) {
  console.log('=== REQUEST START ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Timestamp:', new Date().toISOString());

  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log('CORS headers set successfully');

    if (req.method === 'OPTIONS') {
      console.log('OPTIONS request - returning 200');
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      console.log('GET request - returning health check');
      return res.status(200).json({
        status: 'API_WORKING',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Processing POST request...');
    console.log('Raw body:', req.body);

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key format valid:', apiKey ? apiKey.startsWith('sk-ant-') : false);

    if (!apiKey) {
      console.log('ERROR: API key missing');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract and validate fields
    const { niche, keyword, companyName, affiliateLink, modelTier } = req.body || {};
    console.log('Extracted fields:', { niche, keyword, companyName, affiliateLink, modelTier });

    if (!niche || !keyword || !companyName) {
      console.log('ERROR: Missing required fields');
      console.log('Validation:', { niche: !!niche, keyword: !!keyword, companyName: !!companyName });
      return res.status(400).json({
        error: 'Missing required fields',
        received: { niche: !!niche, keyword: !!keyword, companyName: !!companyName }
      });
    }

    console.log('All validations passed, preparing API call...');

    // Prepare API request
    const prompt = `Write a 1000-word SEO article about ${companyName} in the ${niche} market. Focus on "${keyword}". Include H1 title, multiple H2 sections, and conclusion.`;
    console.log('Prompt prepared, length:', prompt.length);

    const requestBody = {
      model: 'claude-3-haiku-20240307',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    };
    console.log('Claude API request prepared');

    // Make API call
    console.log('Calling Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Claude API response received');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('ERROR: Claude API failed');
      console.log('Error status:', response.status);
      console.log('Error text:', errorText);
      
      return res.status(500).json({
        error: 'Claude API failed',
        status: response.status,
        details: errorText
      });
    }

    console.log('Parsing Claude API response...');
    const data = await response.json();
    console.log('Claude API response parsed successfully');
    console.log('Response structure:', Object.keys(data));

    const content = data.content?.[0]?.text;
    console.log('Content extracted, length:', content ? content.length : 'null');

    if (!content) {
      console.log('ERROR: No content in response');
      console.log('Response data:', data);
      return res.status(500).json({
        error: 'No content generated',
        responseData: data
      });
    }

    // Prepare successful response
    console.log('Preparing successful response...');
    const wordCount = content.split(' ').length;
    const hasH1 = content.includes('# ');
    const h2Count = (content.match(/## /g) || []).length;

    const successResponse = {
      content,
      qualityScore: 85,
      qualityBreakdown: {
        wordCount,
        hasH1Title: hasH1,
        h2Sections: h2Count,
        affiliateLinks: 0
      },
      modelUsed: 'claude-3-haiku-20240307',
      estimatedCost: 0.06,
      debug: {
        requestId: Date.now(),
        timestamp: new Date().toISOString(),
        success: true
      }
    };

    console.log('SUCCESS: Returning generated content');
    console.log('Response prepared, content length:', content.length);
    console.log('=== REQUEST SUCCESS ===');

    return res.status(200).json(successResponse);

  } catch (error) {
    console.log('=== CAUGHT ERROR ===');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('=== ERROR END ===');

    return res.status(500).json({
      error: 'Function crashed',
      message: error.message,
      type: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
}
