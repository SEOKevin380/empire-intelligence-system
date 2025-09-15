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

    // DIAGNOSTIC: Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API Key status:', {
      exists: !!apiKey,
      length: apiKey ? apiKey.length : 0,
      prefix: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
    });

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'ANTHROPIC_API_KEY environment variable not found',
        suggestion: 'Check your Vercel environment variables'
      });
    }

    const targetWords = parseInt(wordCount) || 8000;

    // Enhanced prompt
    const prompt = `You are a world-class content writer specializing in SEO-optimized, conversion-focused articles. Create a comprehensive ${targetWords}-word article about "${keyword}" using ONLY the provided source material as your factual foundation.

CRITICAL REQUIREMENTS:

1. AFFILIATE LINK INTEGRATION: Include this affiliate link naturally throughout the content: "${affiliateLink}" 
   Use compelling call-to-action phrases like "discover more here", "get started today", "try it now".

2. "IN THIS ARTICLE" SECTION - EXACT FORMAT:
   Create a section titled "In This Article, You'll Discover:" with 6-7 sentence-style points.
   DO NOT use bullet symbols (•, –, *, etc.) or emojis.
   Each line should be a complete sentence starting with a capital letter.
   Format as standalone lines with NO special characters in front.

3. FOUR-GOAL STRUCTURE: 
   - Goal 1: Educate about ${keyword} and their benefits
   - Goal 2: Build trust through science, ingredients, and testimonials  
   - Goal 3: Address concerns through comparisons, safety, and FAQs
   - Goal 4: Drive action with clear purchasing guidance

4. SEO OPTIMIZATION:
   - Use "${keyword}" as primary keyword throughout
   - Include variations like "best ${keyword}", "${keyword} benefits"
   - Natural keyword density 1-2%

5. CONVERSION ELEMENTS:
   - Multiple calls-to-action with affiliate link
   - Social proof and testimonials
   - Clear value propositions

6. PROFESSIONAL STRUCTURE:
   - SEO-optimized title
   - TLDR section
   - 8-12 substantial sections
   - FAQ section
   - Strong conclusion with CTA

7. FACTUAL ACCURACY: Base ALL claims on provided source material only.

8. COMPLIANCE: Include health disclaimers and FTC affiliate disclosure.

SOURCE MATERIAL: ${sourceMaterial}

Create compelling, conversion-focused content that guides readers to the affiliate link while providing genuine value.`;

    console.log('Starting API diagnostics...');

    // DIAGNOSTIC: Try a simple API test first
    const testModels = [
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];

    let successfulResponse;
    let diagnosticInfo = [];

    for (const model of testModels) {
      try {
        console.log(`Testing model: ${model}`);
        
        const startTime = Date.now();
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
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

        const responseTime = Date.now() - startTime;
        console.log(`Model ${model} response: ${response.status} (${responseTime}ms)`);

        diagnosticInfo.push({
          model,
          status: response.status,
          statusText: response.statusText,
          responseTime: responseTime,
          success: response.ok
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.content?.[0]?.text;
          
          if (content) {
            successfulResponse = {
              content,
              model,
              wordCount: content.split(/\s+/).length
            };
            console.log(`SUCCESS with ${model}: ${successfulResponse.wordCount} words`);
            break;
          }
        } else {
          // Log error details
          const errorText = await response.text();
          console.log(`Model ${model} error:`, errorText);
          diagnosticInfo[diagnosticInfo.length - 1].errorDetails = errorText;
        }

      } catch (error) {
        console.log(`Model ${model} exception:`, error.message);
        diagnosticInfo.push({
          model,
          error: error.message,
          success: false
        });
      }
    }

    if (successfulResponse) {
      return res.status(200).json({
        success: true,
        content: successfulResponse.content,
        metadata: {
          wordCount: successfulResponse.wordCount,
          keyword,
          publication,
          affiliateLink: affiliateLink || 'None provided',
          modelUsed: successfulResponse.model,
          generatedAt: new Date().toISOString(),
          diagnostics: diagnosticInfo
        }
      });
    }

    // If we get here, all models failed
    console.log('All models failed. Diagnostic summary:', diagnosticInfo);

    // Check for common issues
    const commonIssues = [];
    const firstError = diagnosticInfo.find(d => d.errorDetails);
    
    if (firstError) {
      if (firstError.status === 401) {
        commonIssues.push('API key authentication failed - check if your API key is valid and has billing set up');
      } else if (firstError.status === 429) {
        commonIssues.push('Rate limit exceeded - your API key may have hit usage limits');
      } else if (firstError.status === 400) {
        commonIssues.push('Bad request - there may be an issue with the request format');
      }
    }

    return res.status(500).json({
      error: 'All Claude models failed to respond',
      diagnostics: diagnosticInfo,
      possibleIssues: commonIssues,
      suggestions: [
        'Check your Anthropic API key is valid and active',
        'Verify billing is set up on your Anthropic account',
        'Ensure your API key has sufficient credits',
        'Try again in a few minutes in case of temporary service issues'
      ]
    });

  } catch (error) {
    console.error('Critical error in API handler:', error);
    return res.status(500).json({ 
      error: 'Critical system error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
