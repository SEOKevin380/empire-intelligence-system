// Match Frontend Field Names - /api/generate-content.js
// Updated to match your actual form field names

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    // Extract request data - matching your actual form field names
    const { 
      niche,           // ✅ This works
      keyword,         // Your form uses "keyword" (singular)
      companyName,     // Likely your "product" equivalent 
      platform,        // Additional field from your form
      affiliateLink,   // Your target URL field
      modelTier = 'standard'
    } = req.body;

    // Flexible validation - accept either field naming convention
    const productName = req.body.product || req.body.companyName || req.body.productName;
    const keywords = req.body.keywords || req.body.keyword;
    const targetUrl = req.body.targetUrl || req.body.affiliateLink;

    // Validate required fields with flexible names
    if (!niche || (!productName && !companyName) || !keywords) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          niche: !!niche,
          product: !!(productName || companyName),
          keywords: !!keywords,
          receivedFields: Object.keys(req.body)
        },
        help: 'Required: niche, product/companyName, keyword/keywords'
      });
    }

    // Use the values we found
    const finalProduct = productName || companyName || 'Product';
    const finalKeywords = keywords;
    const finalTargetUrl = targetUrl || 'https://example.com';

    // Model configuration
    const modelConfig = {
      'efficient': {
        model: 'claude-3-haiku-20240307',
        maxTokens: 2000,
        cost: 0.06
      },
      'standard': {
        model: 'claude-3-sonnet-20240229',
        maxTokens: 3000,
        cost: 0.15
      },
      'premium': {
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 4000,
        cost: 0.40
      }
    };

    const selectedModel = modelConfig[modelTier] || modelConfig['standard'];

    // Generate content prompt
    const prompt = `Create a comprehensive SEO-optimized article about "${finalProduct}" in the ${niche} niche, focusing on the keywords "${finalKeywords}". Include proper headings, benefits, usage guidelines, and call-to-action sections. Target URL for links: ${finalTargetUrl}`;

    // Call Claude API with enhanced error handling
    console.log('Calling Claude API with model:', selectedModel.model);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: selectedModel.model,
        max_tokens: selectedModel.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      
      // Handle specific error codes
      if (response.status === 404) {
        return res.status(500).json({
          error: 'Claude API configuration error',
          message: 'API endpoint not found - check model name or API key format',
          details: `Model: ${selectedModel.model}, Status: ${response.status}`
        });
      }
      
      if (response.status === 401) {
        return res.status(500).json({
          error: 'Claude API authentication error',
          message: 'Invalid API key - check ANTHROPIC_API_KEY environment variable'
        });
      }
      
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Return in original format that your frontend expects
    return res.status(200).json({
      content,
      qualityScore: 85,
      qualityBreakdown: {
        wordCount: content.split(' ').length,
        hasH1Title: content.includes('# '),
        h2Sections: (content.match(/## /g) || []).length,
        affiliateLinks: (content.match(/\[.*?\]\(.*?\)/g) || []).length
      },
      modelUsed: selectedModel.model,
      estimatedCost: selectedModel.cost
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ 
      error: 'Content generation failed',
      message: error.message
    });
  }
}
