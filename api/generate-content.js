// api/generate-content.js - WORKING VERSION
export default async function handler(req, res) {
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
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const data = req.body || {};
    console.log('Received data fields:', Object.keys(data));

    // Extract values directly from the exact field names
    const keyword = String(data.keyword || '').trim();
    const sourceMaterial = String(data.sourceMaterial || '').trim();
    const affiliateLink = String(data.affiliateLink || '').trim();
    const wordCount = parseInt(data.wordCount) || 8000;

    console.log('Extracted values:');
    console.log('- Keyword:', keyword);
    console.log('- Source Material length:', sourceMaterial.length);
    console.log('- Affiliate Link:', affiliateLink);
    console.log('- Word Count:', wordCount);

    // Validation with detailed logging
    if (!keyword || keyword.length === 0) {
      console.log('VALIDATION FAILED: Keyword empty');
      return res.status(400).json({ 
        error: 'Keyword is required',
        received: keyword,
        length: keyword.length
      });
    }

    if (!sourceMaterial || sourceMaterial.length < 50) {
      console.log('VALIDATION FAILED: Source material too short');
      return res.status(400).json({ 
        error: 'Source material must be at least 50 characters',
        received_length: sourceMaterial.length
      });
    }

    console.log('✅ Validation passed, generating content...');

    // Build the SEO-optimized prompt using your source material
    const prompt = `You are an expert content writer and SEO specialist. Create a comprehensive, SEO-optimized article following these EXACT requirements:

CRITICAL INSTRUCTION: Base this article entirely on the provided source material. Ensure 100% factual accuracy to the source content.

ARTICLE SPECIFICATIONS:
- Focus Keyword: "${keyword}"
- Target Word Count: ${wordCount} words minimum
- Format: Professional, SEO-optimized article
- Niche: Health & Wellness Supplements

SOURCE MATERIAL (MUST BE 100% ACCURATE):
${sourceMaterial}

${affiliateLink ? `AFFILIATE LINK TO INTEGRATE: ${affiliateLink}` : ''}

MANDATORY ARTICLE STRUCTURE:
1. **In This Article, You'll Discover:** (5-8 bullet points based on source material)
2. **TLDR Summary** (2-3 sentences with focus keyword, based on source material)
3. **Introduction** (Engaging hook using source material facts)
4. **What Are ${keyword}?** (Comprehensive explanation from source material)
5. **Key Benefits of ${keyword}** (Only benefits from source material)
6. **How ${keyword} Work** (Mechanism from source material)
7. **${keyword} Ingredients and Science** (Based on source material)
8. **${keyword} vs Alternatives** (Only if mentioned in source)
9. **How to Use ${keyword}** (Usage info from source material)
10. **Safety and Side Effects** (From source + required disclaimers)
11. **Where to Buy ${keyword}** (Include affiliate link if provided)
12. **Frequently Asked Questions** (Based on source material)
13. **Final Thoughts and Recommendations**

FORMATTING REQUIREMENTS:
- **Bold all headings** using **text**
- **Bold important links** and key terms
- NO emojis - professional formatting only
- Minimum ${wordCount} words
- Natural keyword density (1-2% for "${keyword}")
- Include semantic variations from source material

REQUIRED DISCLAIMERS:
- Health: "This information is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before starting any new supplement regimen."
- Pricing: "Prices are subject to change. Please check the official website for current pricing information."
- Individual Results: "Individual results may vary based on personal factors and consistency of use."

SEO OPTIMIZATION:
- Include "${keyword}" naturally throughout content
- Use related terms from source material as LSI keywords
- Create compelling, descriptive headings
- Add conversion-focused calls to action
- Include internal linking opportunities where relevant

ACCURACY REQUIREMENTS:
- Use ONLY information from the provided source material
- Do NOT add claims not supported by the source
- If expanding on source points, clearly indicate when making logical extensions
- Maintain 100% factual accuracy to source content

Create the complete, comprehensive article now, ensuring it meets the minimum word count by thoroughly explaining all concepts from the source material:`;

    const messages = [{ role: "user", content: prompt }];

    console.log('Sending request to Anthropic API...');

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
        messages: messages,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Content generation failed',
        status: response.status,
        details: errorText.substring(0, 300)
      });
    }

    const result = await response.json();
    const content = result.content[0].text;
    const actualWordCount = content.split(' ').length;

    console.log('✅ Content generated successfully');
    console.log('Word count:', actualWordCount);

    return res.status(200).json({
      success: true,
      content: content,
      metadata: {
        wordCount: actualWordCount,
        targetWordCount: wordCount,
        keyword: keyword,
        sourceMaterialLength: sourceMaterial.length,
        hasAffiliateLink: !!affiliateLink,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
