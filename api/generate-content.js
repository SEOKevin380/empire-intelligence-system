// api/generate-content.js
// COMPLETE FILE - Replace your entire existing file with this exact code
// Copy everything from here to the end

export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Log the incoming request for debugging
    console.log('=== EMPIRE INTELLIGENCE API CALL ===');
    console.log('Request method:', req.method);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY environment variable not found');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured. Please check environment variables.'
      });
    }

    console.log('✅ API key found');

    // Extract all possible field names from the request
    const {
      keyword,
      topic,
      niche,
      contentType,
      content_type,
      platform,
      sourceMaterial,
      source_material,
      wordCount,
      word_count,
      targetAudience,
      target_audience,
      tone,
      style,
      instructions,
      customInstructions,
      custom_instructions,
      // Catch any other fields
      ...additionalFields
    } = req.body || {};

    // Create a unified data object with fallbacks
    const contentData = {
      topic: keyword || topic || 'general content',
      niche: niche || 'general',
      contentType: contentType || content_type || 'article',
      platform: platform || 'website',
      sourceMaterial: sourceMaterial || source_material || '',
      wordCount: wordCount || word_count || 1000,
      targetAudience: targetAudience || target_audience || 'general audience',
      tone: tone || 'professional',
      style: style || 'informative',
      instructions: instructions || customInstructions || custom_instructions || '',
      additionalFields
    };

    console.log('📊 Processed content data:', JSON.stringify(contentData, null, 2));

    // Build comprehensive prompt for Claude
    const systemPrompt = `You are an expert content creator specializing in ${contentData.niche} content. Create high-quality, engaging, and professional content based on the following requirements:

CONTENT SPECIFICATIONS:
- Topic: ${contentData.topic}
- Niche: ${contentData.niche}
- Content Type: ${contentData.contentType}
- Target Platform: ${contentData.platform}
- Word Count: Approximately ${contentData.wordCount} words
- Target Audience: ${contentData.targetAudience}
- Tone: ${contentData.tone}
- Style: ${contentData.style}

${contentData.sourceMaterial ? `SOURCE MATERIAL TO REFERENCE:
${contentData.sourceMaterial}

Please ensure 100% accuracy to the source material provided above.` : ''}

${contentData.instructions ? `ADDITIONAL INSTRUCTIONS:
${contentData.instructions}` : ''}

REQUIREMENTS:
1. Create compelling, original content that matches the specified parameters
2. Ensure content is optimized for the target platform
3. Use proper formatting and structure appropriate for the content type
4. Include engaging headlines, subheadings, and clear calls to action where appropriate
5. Maintain professional quality while being accessible to the target audience
6. If source material is provided, ensure complete accuracy and proper integration

Please create the content now:`;

    const messages = [{ 
      role: "user", 
      content: systemPrompt 
    }];

    console.log('🤖 Sending request to Anthropic Claude API...');
    console.log('Prompt length:', systemPrompt.length, 'characters');

    // Make the API call to Anthropic
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: messages,
        temperature: 0.7
      })
    });

    console.log('📡 Anthropic API response status:', anthropicResponse.status);

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('❌ Anthropic API Error:', errorText);
      
      return res.status(anthropicResponse.status).json({ 
        error: `Anthropic API Error (${anthropicResponse.status})`,
        message: 'Failed to generate content. Please try again.',
        details: errorText.substring(0, 300)
      });
    }

    const anthropicData = await anthropicResponse.json();
    console.log('✅ Content generation successful');
    console.log('📝 Generated content length:', anthropicData.content[0].text.length, 'characters');
    console.log('💰 API usage:', JSON.stringify(anthropicData.usage, null, 2));

    // Return successful response
    const successResponse = {
      success: true,
      content: anthropicData.content[0].text,
      metadata: {
        model: "claude-sonnet-4-20250514",
        contentLength: anthropicData.content[0].text.length,
        wordCount: anthropicData.content[0].text.split(' ').length,
        usage: anthropicData.usage,
        generatedAt: new Date().toISOString(),
        requestData: {
          topic: contentData.topic,
          niche: contentData.niche,
          contentType: contentData.contentType,
          platform: contentData.platform
        }
      }
    };

    console.log('🎉 Sending successful response');
    res.status(200).json(successResponse);

  } catch (error) {
    console.error('💥 CRITICAL ERROR in generate-content API:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Content generation failed due to server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// End of file - Make sure you copy everything above this line
