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

    // Enhanced prompt with all requirements
    const prompt = `You are a world-class content writer specializing in SEO-optimized, conversion-focused articles. Create a comprehensive ${targetWords}-word article about "${keyword}" using ONLY the provided source material as your factual foundation.

CRITICAL REQUIREMENTS:

1. AFFILIATE LINK INTEGRATION: Include this affiliate link naturally throughout the content at least 3-4 times: "${affiliateLink}" 
   Use compelling call-to-action phrases like "discover more here", "get started today", "try it now", "learn more", etc.

2. "IN THIS ARTICLE" SECTION - EXACT FORMAT REQUIRED:
   Create a section titled "In This Article, You'll Discover:" with 6-7 sentence-style points.
   DO NOT use bullet symbols (•, –, *, etc.) or emojis.
   Each line should be a complete sentence starting with a capital letter.
   Format as standalone lines with NO special characters in front.

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

7. FACTUAL ACCURACY: Base ALL claims strictly on the provided source material. Do not invent facts.

8. COMPLIANCE: Include health disclaimers and FTC affiliate disclosure.

SOURCE MATERIAL:
${sourceMaterial}

TARGET: ${targetWords} words
AFFILIATE LINK: ${affiliateLink}
PUBLICATION: ${publication}

Create compelling, conversion-focused content that naturally guides readers to the affiliate link while providing genuine value.`;

    console.log('Making request to Claude API...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    // Try the most commonly working model names in order
    const modelNames = [
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229', 
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307'
    ];

    let response;
    let lastError;

    // Try each model until one works
    for (const model of modelNames) {
      try {
        console.log(`Trying model: ${model}`);
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 8000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        if (response.ok) {
          console.log(`Success with model: ${model}`);
          break;
        } else {
          const errorText = await response.text();
          console.log(`Model ${model} failed:`, response.status, errorText);
          lastError = { status: response.status, text: errorText };
        }
      } catch (error) {
        console.log(`Model ${model} error:`, error.message);
        lastError = { error: error.message };
      }
    }

    if (!response || !response.ok) {
      console.error('All models failed. Last error:', lastError);
      return res.status(500).json({ 
        error: 'All Claude models failed to respond',
        details: lastError,
        suggestion: 'Please check your API key and try again later'
      });
    }

    const responseText = await response.text();
    console.log('Raw API Response length:', responseText.length);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response:', e);
      return res.status(500).json({ 
        error: 'Invalid API response format',
        rawResponse: responseText.substring(0, 500)
      });
    }

    const generatedContent = data.content?.[0]?.text;

    if (!generatedContent) {
      console.error('No content in Claude response:', data);
      return res.status(500).json({ 
        error: 'No content generated from API',
        apiResponse: data
      });
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
      message: error.message,
      stack: error.stack
    });
  }
}
