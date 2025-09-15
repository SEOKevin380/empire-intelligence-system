export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyword, sourceMaterial, affiliateLink, wordCount, publication, company, email, phone } = req.body;

    // Validation
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    if (!sourceMaterial || sourceMaterial.length < 50) {
      return res.status(400).json({ error: 'Source material must be at least 50 characters' });
    }

    if (!publication) {
      return res.status(400).json({ error: 'Publication is required' });
    }

    const targetWords = parseInt(wordCount) || 8000;

    // Enhanced prompt with all your specific requirements
    const prompt = `You are a world-class content writer specializing in SEO-optimized, conversion-focused articles. Create a comprehensive ${targetWords}-word article about "${keyword}" using ONLY the provided source material as your factual foundation.

CRITICAL REQUIREMENTS:

1. AFFILIATE LINK INTEGRATION: Include this affiliate link naturally throughout the content at least 3-4 times: "${affiliateLink}" 
   Use compelling call-to-action phrases like "discover more here", "get started today", "try it now", "learn more", etc.

2. "IN THIS ARTICLE" SECTION - EXACT FORMAT REQUIRED:
   Create a section titled "In This Article, You'll Discover:" with 6-7 sentence-style points.
   DO NOT use bullet symbols (•, –, *, etc.) or emojis.
   Each line should be a complete sentence starting with a capital letter.
   Format as standalone lines with NO special characters in front.
   Example:
   "In This Article, You'll Discover:
   What mushroom gummies are and why they're becoming essential for modern wellness
   The complete ingredient breakdown of the top-rated mushroom gummies available today
   How these supplements support weight loss, focus, and stress management simultaneously
   The science behind why these specific mushroom combinations work so effectively
   Real user experiences and testimonials from people who've transformed their health
   Professional comparisons showing why these stand out from other mushroom supplements"

3. FOUR-GOAL STRUCTURE: 
   - Goal 1: Educate about ${keyword} and their benefits
   - Goal 2: Build trust through science, ingredients, and testimonials  
   - Goal 3: Address concerns through comparisons, safety, and FAQs
   - Goal 4: Drive action with clear purchasing guidance and affiliate links

4. SEO OPTIMIZATION:
   - Use "${keyword}" as primary keyword throughout (natural density 1-2%)
   - Include variations like "best ${keyword}", "${keyword} benefits", "${keyword} reviews"
   - Create compelling, keyword-rich headers

5. CONVERSION ELEMENTS:
   - Multiple compelling calls-to-action with the affiliate link
   - Social proof and testimonials from the source material
   - Clear value propositions and benefits
   - Urgency and scarcity where appropriate

6. PROFESSIONAL STRUCTURE:
   - SEO-optimized title
   - "In This Article, You'll Discover:" section (exact clean format above)
   - TLDR section with key benefits
   - 8-12 substantial sections with descriptive headers
   - Comprehensive FAQ section
   - Strong conclusion with affiliate link CTA

7. FACTUAL ACCURACY: Base ALL claims strictly on the provided source material. Do not invent facts, statistics, or claims not supported by the source.

8. COMPLIANCE: Include appropriate health disclaimers and FTC affiliate disclosure.

SOURCE MATERIAL (USE EXCLUSIVELY):
${sourceMaterial}

AFFILIATE LINK TO INTEGRATE: ${affiliateLink}
PUBLICATION: ${publication}
TARGET WORD COUNT: ${targetWords} words

Create compelling, conversion-focused content that naturally guides readers to the affiliate link while providing genuine value and maintaining SEO optimization throughout.`;

    console.log('Making request to Claude API with corrected model...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Corrected model name
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { error: responseText };
      }
      
      console.error('Claude API Error:', response.status, response.statusText, errorData);
      
      if (response.status === 400) {
        return res.status(500).json({ 
          error: 'API request format error. Please check model name and parameters.',
          details: errorData.error || 'Bad Request'
        });
      }
      
      if (response.status === 401) {
        return res.status(500).json({ 
          error: 'API authentication failed. Please check API key configuration.',
          details: 'Unauthorized access to Claude API'
        });
      }
      
      return res.status(500).json({ 
        error: `Content generation failed: ${response.status}`,
        details: errorData.error || response.statusText
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response:', e);
      return res.status(500).json({ error: 'Invalid API response format' });
    }

    const generatedContent = data.content?.[0]?.text;

    if (!generatedContent) {
      console.error('No content in Claude response:', data);
      return res.status(500).json({ error: 'No content generated from API' });
    }

    // Estimate word count
    const estimatedWordCount = generatedContent.split(/\s+/).length;

    console.log(`Content generated successfully: ${estimatedWordCount} words`);
    
    return res.status(200).json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: estimatedWordCount,
        keyword,
        publication,
        affiliateLink: affiliateLink || 'None provided',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in generate-content API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
