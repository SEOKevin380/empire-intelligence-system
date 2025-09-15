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
    console.log('- Affiliate Link:', affiliateLink ? 'Provided' : 'None');
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
    console.log('Making Claude API call...');

    // Build enhanced content generation prompt
    const prompt = `You are an expert SEO content writer and conversion specialist. Create a comprehensive, high-converting article about "${keyword}" that follows these EXACT requirements:

## CRITICAL FORMATTING REQUIREMENTS:

1. **"In This Article" Section**: Create a clean, professional section titled "In This Article, You'll Discover:" featuring 6-7 sentence-style lines. Do NOT use any bullet symbols (•, –, *, etc.) or emojis. Each line should be a full sentence or clause, start with a capital letter, and be formatted as standalone lines without special characters. Example format:

In This Article, You'll Discover:
The complete science behind mushroom gummies and their cognitive benefits
How leading brands are revolutionizing wellness through innovative formulations
Expert analysis of the top-performing mushroom gummy products in 2025
Clinical research findings that support mushroom supplementation claims
Professional recommendations for choosing the right mushroom gummies
Common mistakes people make when selecting wellness supplements
Why timing and dosage matter for optimal cognitive enhancement results

2. **Affiliate Link Integration**: ${affiliateLink ? `Naturally integrate this affiliate link throughout the content: ${affiliateLink}. Include it in:
- A compelling call-to-action in the introduction
- Product recommendation sections
- Conclusion with strong conversion language
- Use phrases like "Based on our extensive research, we recommend..." and "Click here to learn more about our top recommendation"` : 'Include general calls-to-action without specific affiliate links'}

3. **4-Goal Content Structure**:
   - GOAL 1: EDUCATE (Establish expertise and provide valuable information)
   - GOAL 2: BUILD TRUST (Include credentials, research, testimonials)
   - GOAL 3: ADDRESS CONCERNS (Handle objections and hesitations)
   - GOAL 4: DRIVE ACTION (Multiple compelling CTAs with urgency)

4. **Word Count**: Target approximately ${wordCount || '8000'} words with comprehensive coverage

5. **SEO Optimization**: 
   - Use "${keyword}" and semantic variations throughout
   - Include related keywords naturally
   - Optimize for search intent and user engagement
   - Create scannable headings and subheadings

## SOURCE MATERIAL TO USE:
${sourceMaterial}

## CONTENT REQUIREMENTS:
- Write in an authoritative, professional tone
- Include health disclaimers where appropriate
- Add FTC compliance language for affiliate recommendations
- Use compelling headlines and subheadings
- Include specific product details and benefits
- Create urgency and social proof elements
- End with strong conversion-focused conclusion

## CRITICAL: 
- Follow the exact "In This Article" format shown above (no bullets, clean sentences)
- Integrate affiliate links naturally with compelling CTAs
- Ensure content flows logically through the 4-goal structure
- Make the content highly engaging and conversion-focused

Create the complete article now:`;

    // Make Claude API call with correct headers
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'  // CRITICAL: This header was missing!
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
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

    const generatedContent = data.content[0].text;
    console.log('Content generated successfully, length:', generatedContent.length);

    console.log('=== EMPIRE INTELLIGENCE CONTENT GENERATION SUCCESS ===');

    // Return successful response
    return res.status(200).json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: generatedContent.split(' ').length,
        keyword: keyword,
        timestamp: new Date().toISOString(),
        affiliateLinkUsed: !!affiliateLink
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
