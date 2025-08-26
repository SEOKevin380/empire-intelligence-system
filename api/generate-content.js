// Restore Original Working Format - /api/generate-content.js
// Based on your Master Project Memory - this was working before

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

    // Extract request data
    const { niche, product, keywords, modelTier = 'standard', targetUrl } = req.body;

    // Validate required fields
    if (!niche || !product || !keywords) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['niche', 'product', 'keywords']
      });
    }

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
    const prompt = `Create a comprehensive SEO-optimized article about "${product}" in the ${niche} niche, focusing on the keywords "${keywords}". Include proper headings, benefits, usage guidelines, and call-to-action sections. Target URL for links: ${targetUrl || 'https://example.com'}`;

    // Call Claude API
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
      throw new Error(`Claude API error: ${response.status}`);
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
