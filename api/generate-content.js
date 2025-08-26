// Correct Claude Model Names - /api/generate-content.js
// Using verified working Claude model identifiers

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

    // Extract request data - matching your form field names
    const { 
      niche,
      keyword,         // Your form uses "keyword" (singular)
      companyName,     // Your "product" field
      affiliateLink,   // Your target URL field
      modelTier = 'standard'
    } = req.body;

    // Validate required fields
    if (!niche || !companyName || !keyword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          niche: !!niche,
          companyName: !!companyName,
          keyword: !!keyword
        }
      });
    }

    // Corrected model configuration with working model names
    const modelConfig = {
      'efficient': {
        model: 'claude-3-haiku-20240307',     // ✅ This works
        maxTokens: 2000,
        cost: 0.06
      },
      'standard': {
        model: 'claude-3-5-sonnet-20240620', // ✅ Corrected model name
        maxTokens: 3000,
        cost: 0.15
      },
      'premium': {
        model: 'claude-3-5-sonnet-20240620', // ✅ Same corrected model
        maxTokens: 4000,
        cost: 0.40
      }
    };

    const selectedModel = modelConfig[modelTier] || modelConfig['standard'];

    // Generate SEO content prompt
    const prompt = `Create a comprehensive SEO-optimized article about "${companyName}" in the ${niche} niche, focusing on the keywords "${keyword}".

Include:
- Compelling H1 title with the keyword
- 8+ H2 sections with detailed content
- Benefits, features, and usage guidelines
- User testimonials and social proof
- FAQ section with 5+ relevant questions
- Strong call-to-action sections
- Affiliate links using: ${affiliateLink || 'https://example.com'}

Target word count: 2000+ words. Use professional, engaging tone with proper formatting.`;

    console.log('Calling Claude API with model:', selectedModel.model);

    // Call Claude API with correct model
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
      
      return res.status(500).json({
        error: 'Content generation failed',
        message: 'AI service error',
        details: `Status: ${response.status}`
      });
    }

    const data = await response.json();
    const content = data.content[0].text;

    console.log('Content generated successfully, length:', content.length);

    // Analyze content quality
    const wordCount = content.split(' ').length;
    const hasH1 = content.includes('# ');
    const h2Count = (content.match(/## /g) || []).length;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;

    // Return successful response
    return res.status(200).json({
      content,
      qualityScore: Math.min(95, Math.round(
        (wordCount >= 1500 ? 30 : 20) +
        (hasH1 ? 20 : 0) +
        (h2Count >= 6 ? 20 : h2Count * 3) +
        (linkCount >= 3 ? 15 : linkCount * 5) +
        10 // base score
      )),
      qualityBreakdown: {
        wordCount,
        hasH1Title: hasH1,
        h2Sections: h2Count,
        affiliateLinks: linkCount
      },
      modelUsed: selectedModel.model,
      estimatedCost: selectedModel.cost
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ 
      error: 'Content generation failed',
      message: 'Internal server error'
    });
  }
}
