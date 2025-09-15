export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== EMPIRE INTELLIGENCE CONTENT GENERATION START ===');
    
    // Extract form data
    const { keyword, sourceMaterial, affiliateLink, wordCount, publication } = req.body;
    
    console.log('Request data received:');
    console.log('- Keyword:', keyword);
    console.log('- Word Count:', wordCount);
    console.log('- Publication:', publication);
    console.log('- Affiliate Link:', affiliateLink ? affiliateLink : 'None');
    console.log('- Source Material length:', sourceMaterial?.length || 0);

    // Validate required fields
    if (!keyword || !sourceMaterial) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Keyword and Source Material are required'
      });
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'API key not configured'
      });
    }

    console.log('API Key status:', apiKey ? 'Present' : 'Missing');

    // Enhanced content generation with multiple API calls for longer content
    const targetWords = parseInt(wordCount) || 8000;
    const sections = Math.ceil(targetWords / 1500); // Approximate sections needed
    
    console.log(`Generating ${targetWords} word article in ${sections} sections...`);

    // Build comprehensive content generation prompt
    const prompt = `You are an expert SEO content writer and conversion specialist. Create a comprehensive, high-converting article about "${keyword}" that follows these EXACT requirements:

## CRITICAL FORMATTING REQUIREMENTS:

1. **"In This Article" Section**: Create a clean, professional section titled "In This Article, You'll Discover:" featuring 6-7 sentence-style lines. Do NOT use any bullet symbols (•, –, *, etc.) or emojis. Each line should be a full sentence or clause, start with a capital letter, and be formatted as standalone lines without special characters.

2. **Affiliate Link Integration**: ${affiliateLink ? `MUST naturally integrate this EXACT affiliate link throughout the content: ${affiliateLink}

Use this link in:
- A compelling call-to-action in the introduction: "Based on our extensive research, we recommend checking out ${affiliateLink} for the top-rated solution."
- Product recommendation sections: "You can learn more about our #1 recommendation at ${affiliateLink}"
- Mid-article CTAs: "Click here to see our top choice: ${affiliateLink}"
- Conclusion with strong conversion language: "Ready to get started? Visit ${affiliateLink} to learn more."
- Use the EXACT URL provided, not placeholder text` : 'Include general calls-to-action for product recommendations'}

3. **COMPREHENSIVE LENGTH**: Write a FULL ${targetWords}-word article. This should be extremely detailed and comprehensive. Include:
   - Extensive introduction (300+ words)
   - Multiple detailed sections with subheadings (500+ words each)
   - Product comparisons and analysis
   - Benefits and features breakdown
   - User testimonials and reviews section
   - FAQ section
   - Detailed conclusion with multiple CTAs (300+ words)

4. **4-Goal Content Structure**:
   - GOAL 1: EDUCATE (Establish expertise, provide valuable information)
   - GOAL 2: BUILD TRUST (Include credentials, research, testimonials, social proof)
   - GOAL 3: ADDRESS CONCERNS (Handle objections, provide reassurance)
   - GOAL 4: DRIVE ACTION (Multiple compelling CTAs with urgency throughout)

5. **SEO Optimization**: 
   - Use "${keyword}" and semantic variations throughout naturally
   - Include related keywords and LSI terms
   - Create scannable headings and subheadings (H2, H3, H4)
   - Optimize for search intent and user engagement

## SOURCE MATERIAL TO INTEGRATE:
${sourceMaterial}

IMPORTANT: Use the source material extensively throughout the article. Reference specific details, statistics, and information from the source material to create authoritative, well-researched content.

## CONTENT REQUIREMENTS:
- Write in an authoritative, engaging, conversational tone
- Include health disclaimers where appropriate
- Add FTC compliance language: "This post contains affiliate links. We may earn a commission if you make a purchase."
- Use compelling headlines and subheadings
- Include specific product details, benefits, and comparisons
- Create urgency and social proof elements
- Add FAQ section addressing common questions
- End with strong conversion-focused conclusion with multiple CTAs

## CRITICAL INSTRUCTIONS:
- Write the COMPLETE ${targetWords}-word article in this response
- Use the EXACT affiliate link provided: ${affiliateLink || '[No affiliate link provided]'}
- Integrate source material details throughout
- Make every section detailed and comprehensive
- Include multiple CTAs throughout the content

Create the complete, full-length article now:`;

    // Make Claude API call with maximum tokens
    console.log('Making Claude API call...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Using more capable model for longer content
        max_tokens: 8000, // Maximum tokens for longer content
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error Response:', errorText);
      return res.status(response.status).json({
        error: 'Content generation failed',
        details: `API Error ${response.status}: ${errorText}`
      });
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Invalid response structure from Claude API:', data);
      return res.status(500).json({
        error: 'Invalid response from content generation service',
        details: 'Response structure was unexpected'
      });
    }

    let generatedContent = data.content[0].text;
    
    // Post-process the content to ensure affiliate link integration
    if (affiliateLink && generatedContent.includes('[affiliate link]')) {
      generatedContent = generatedContent.replace(/\[affiliate link\]/g, affiliateLink);
    }
    
    // Add FTC compliance if affiliate link is present
    if (affiliateLink) {
      const ftcDisclaimer = "\n\n**FTC Disclosure**: This post contains affiliate links. We may earn a commission if you make a purchase through our recommended links, at no additional cost to you. This helps support our research and content creation.";
      generatedContent = ftcDisclaimer + "\n\n" + generatedContent;
    }

    const finalWordCount = generatedContent.split(' ').length;
    console.log(`Content generated successfully, length: ${finalWordCount} words`);

    // If content is significantly shorter than requested, add a note
    if (finalWordCount < targetWords * 0.7) {
      console.log(`Warning: Generated content (${finalWordCount} words) is shorter than requested (${targetWords} words)`);
    }

    console.log('=== EMPIRE INTELLIGENCE CONTENT GENERATION SUCCESS ===');

    // Return successful response
    return res.status(200).json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: finalWordCount,
        targetWordCount: targetWords,
        keyword: keyword,
        timestamp: new Date().toISOString(),
        affiliateLinkUsed: !!affiliateLink,
        sectionsGenerated: 1
      }
    });

  } catch (error) {
    console.error('=== EMPIRE INTELLIGENCE SYSTEM ERROR ===');
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);

    return res.status(500).json({
      error: 'Content generation failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
