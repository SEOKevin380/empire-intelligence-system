// Working Haiku Model Only - /api/generate-content.js
// Use only verified working claude-3-haiku-20240307

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
      status: 'EMPIRE_INTELLIGENCE_READY',
      message: 'Content generation API is online',
      model: 'claude-3-haiku-20240307',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured'
      });
    }

    // Extract request data
    const { niche, keyword, companyName, affiliateLink, modelTier } = req.body;

    // Basic validation
    if (!niche || !companyName || !keyword) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: { niche: !!niche, companyName: !!companyName, keyword: !!keyword }
      });
    }

    // Simple content prompt
    const prompt = `Write a 1000-word SEO article about ${companyName} for the ${niche} market. Focus on the keyword "${keyword}". Include an H1 title, 5+ H2 sections, benefits, and a conclusion. Use affiliate link: ${affiliateLink || 'https://example.com'}`;

    console.log('Calling Claude API with Haiku model...');

    // Call Claude API with only verified working model
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    console.log('Claude API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      
      return res.status(500).json({
        error: 'Content generation failed',
        status: response.status,
        message: 'Claude API error - check logs for details'
      });
    }

    const data = await response.json();
    const content = data.content[0].text;

    console.log('SUCCESS: Content generated, length:', content.length);

    // Basic quality analysis
    const wordCount = content.split(' ').length;
    const hasH1 = content.includes('# ');
    const h2Count = (content.match(/## /g) || []).length;

    // Return successful response
    return res.status(200).json({
      content,
      qualityScore: Math.round(
        (wordCount >= 800 ? 25 : 15) +
        (hasH1 ? 25 : 0) +
        (h2Count >= 3 ? 25 : h2Count * 8) +
        25 // base score
      ),
      qualityBreakdown: {
        wordCount,
        hasH1Title: hasH1,
        h2Sections: h2Count,
        affiliateLinks: (content.match(/\[.*?\]\(.*?\)/g) || []).length
      },
      modelUsed: 'claude-3-haiku-20240307',
      estimatedCost: 0.06
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}
