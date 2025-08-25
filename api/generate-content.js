// /api/generate-content.js
// Vercel Serverless Function for Empire Intelligence System
// CORRECTED VERSION - Fixed API headers and model name

export default async function handler(req, res) {
  // Set CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    // Extract request data
    const { 
      niche, 
      contentType, 
      platform, 
      sourceMaterial, 
      targetAudience, 
      wordCount,
      additionalRequirements,
      keyword,
      affiliateLink,
      companyName,
      email,
      phone,
      authorCredentials
    } = req.body;

    // Validate required fields
    if (!niche || !contentType || !platform) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['niche', 'contentType', 'platform']
      });
    }

    // Build the content generation prompt
    const prompt = buildContentPrompt({
      niche,
      contentType,
      platform,
      sourceMaterial,
      targetAudience,
      wordCount,
      additionalRequirements,
      keyword,
      affiliateLink,
      companyName,
      email,
      phone,
      authorCredentials
    });

    console.log('Making Claude API call...');

    // Call Anthropic Claude API with CORRECT headers
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,  // FIXED: lowercase x-api-key
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',  // FIXED: Updated model
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log('Claude API response status:', claudeResponse.status);

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API Error:', errorData);
      return res.status(claudeResponse.status).json({
        error: 'Content generation failed',
        message: 'API service temporarily unavailable',
        statusCode: claudeResponse.status,
        details: errorData
      });
    }

    const data = await claudeResponse.json();
    const generatedContent = data.content[0].text;

    console.log('Content generated successfully');

    // Calculate quality score
    const qualityScore = calculateQualityScore(generatedContent, {
      niche,
      contentType,
      platform,
      wordCount
    });

    // Generate compliance disclaimers
    const disclaimers = generateCompliance(niche, platform);

    // Return successful response
    res.status(200).json({
      success: true,
      content: generatedContent,
      qualityScore,
      disclaimers,
      metadata: {
        niche,
        contentType,
        platform,
        wordCount: generatedContent.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Content generation failed unexpectedly',
      details: error.message
    });
  }
}

// Build comprehensive content generation prompt
function buildContentPrompt({
  niche,
  contentType,
  platform,
  sourceMaterial,
  targetAudience,
  wordCount,
  additionalRequirements,
  keyword,
  affiliateLink,
  companyName,
  email,
  phone,
  authorCredentials
}) {
  const basePrompt = `Generate professional ${contentType} content about "${keyword}" for ${niche} niche, optimized for ${platform} platform.

CONTENT SPECIFICATIONS:
- Niche: ${niche}
- Content Type: ${contentType}
- Platform: ${platform}
- Target Word Count: ${wordCount || '500-800'} words
- Target Audience: ${targetAudience || 'General audience'}
- Keyword Focus: ${keyword}

QUALITY REQUIREMENTS:
- Professional, authoritative tone
- SEO-optimized structure with ${keyword} integration
- Industry-specific expertise
- Factual accuracy required
- Engaging and valuable content

COMPLIANCE REQUIREMENTS:
- YMYL (Your Money Your Life) standards if applicable
- FTC disclosure compliance for sponsored content
- Platform-specific guidelines adherence
- Professional disclaimers where required

SOURCE MATERIAL INTEGRATION:
${sourceMaterial ? `Base content strictly on this source material:\n${sourceMaterial}\n` : 'Generate original, well-researched content'}

${contentType === 'affiliate' && affiliateLink ? `
AFFILIATE INTEGRATION:
- Include this affiliate link naturally: ${affiliateLink}
- Add clear affiliate disclosure
` : ''}

COMPANY INFORMATION:
${companyName ? `Company: ${companyName}` : ''}
${email ? `Contact: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}
${authorCredentials ? `Author: ${authorCredentials}` : ''}

ADDITIONAL REQUIREMENTS:
${additionalRequirements || 'Follow standard industry best practices'}

FORMAT: Provide clean, formatted content ready for publication without additional commentary or explanations.`;

  return basePrompt;
}

// Calculate content quality score
function calculateQualityScore(content, params) {
  let score = 100;
  const wordCount = content.split(' ').length;
  const targetWords = parseInt(params.wordCount) || 600;

  // Word count scoring
  const wordRatio = wordCount / targetWords;
  if (wordRatio < 0.8 || wordRatio > 1.3) score -= 15;
  else if (wordRatio < 0.9 || wordRatio > 1.1) score -= 5;

  // Content structure scoring
  const paragraphs = content.split('\n\n').length;
  if (paragraphs < 3) score -= 10;
  if (paragraphs > 15) score -= 5;

  // Professional indicators
  if (content.includes('disclaimer') || content.includes('important')) score += 5;
  if (content.includes('research') || content.includes('study')) score += 3;
  
  // Quality indicators
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentences;
  if (avgWordsPerSentence > 25) score -= 5; // Too complex
  if (avgWordsPerSentence < 10) score -= 3; // Too simple

  return Math.max(Math.min(score, 100), 60); // Cap between 60-100
}

// Generate compliance disclaimers based on niche and platform
function generateCompliance(niche, platform) {
  const disclaimers = [];

  // YMYL niches require special disclaimers
  const ymylNiches = ['health', 'finance', 'legal', 'safety'];
  if (ymylNiches.some(ymyl => niche.toLowerCase().includes(ymyl))) {
    if (niche.toLowerCase().includes('health')) {
      disclaimers.push('Medical Disclaimer: This content is for informational purposes only and should not replace professional medical advice. Consult with a healthcare provider for medical concerns.');
    }
    if (niche.toLowerCase().includes('finance')) {
      disclaimers.push('Financial Disclaimer: This content is for educational purposes only and does not constitute financial advice. Consult with a financial advisor before making investment decisions.');
    }
  }

  // Platform-specific compliance
  if (platform === 'sponsored-post') {
    disclaimers.push('FTC Disclosure: This is sponsored content. The publisher may receive compensation for this publication.');
  }

  if (platform === 'globe-newswire' || platform === 'newswire') {
    disclaimers.push('Press Release Notice: This content is provided for informational purposes. Verify all claims independently before taking action.');
  }

  return disclaimers;
}
