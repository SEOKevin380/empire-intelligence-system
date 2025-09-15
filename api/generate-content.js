// api/generate-content.js - RELIABLE SIMPLIFIED VERSION
// Replace your entire file with this code

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Content generation request received');
    
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('No API key found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract data with fallbacks
    const data = req.body || {};
    const keyword = data.keyword || data.topic || 'content topic';
    const niche = data.niche || 'general';
    const sourceMaterial = data.sourceMaterial || data.source_material || '';
    const affiliateLink = data.affiliateLink || data.affiliate_link || '';
    const wordCount = data.wordCount || data.word_count || 4000;

    console.log(`Generating content for: ${keyword}`);

    // Build SEO-optimized prompt
    const prompt = `You are an expert content creator and SEO specialist. Create a comprehensive, SEO-optimized article with these requirements:

ARTICLE REQUIREMENTS:
- Topic/Focus Keyword: "${keyword}"
- Niche: ${niche}
- Target Word Count: ${wordCount} words minimum
- Format: Professional article with SEO optimization

${sourceMaterial ? `SOURCE MATERIAL (ensure 100% accuracy):
${sourceMaterial}` : ''}

${affiliateLink ? `AFFILIATE LINK TO INTEGRATE: ${affiliateLink}` : ''}

MANDATORY STRUCTURE:
1. **In This Article, You'll Discover:** (bullet points outlining key topics)
2. **TLDR Summary** (brief overview with focus keywords)
3. **Introduction** (engaging hook with focus keyword)
4. **Main Content Sections** (comprehensive coverage with bold headings)
5. **Benefits and Features** (detailed explanation)
6. **How It Works** (mechanism or process)
7. **Comparison with Alternatives** 
8. **Usage Guidelines** (if applicable)
9. **Safety and Side Effects** (with disclaimers for health topics)
10. **Where to Purchase** (include affiliate link if provided)
11. **FAQ Section**
12. **Conclusion**

FORMATTING REQUIREMENTS:
- Bold all headings using **text**
- Bold important links
- NO emojis - professional formatting only
- Include appropriate disclaimers for health/financial claims
- Add pricing disclaimers where applicable
- Ensure minimum ${wordCount} words
- Natural keyword integration (avoid stuffing)
- Include related semantic keywords

DISCLAIMERS TO INCLUDE:
- Health topics: "This information is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before use."
- Pricing: "Prices subject to change. Check official website for current pricing."

Create the complete article now, ensuring all requirements are met.`;

    const messages = [{ role: "user", content: prompt }];

    console.log('Calling Anthropic API...');

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Content generation failed',
        status: response.status
      });
    }

    const result = await response.json();
    const content = result.content[0].text;
    const actualWordCount = content.split(' ').length;

    console.log(`Content generated successfully. Word count: ${actualWordCount}`);

    // Return success response
    return res.status(200).json({
      success: true,
      content: content,
      metadata: {
        wordCount: actualWordCount,
        targetWordCount: wordCount,
        keyword: keyword,
        niche: niche,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
