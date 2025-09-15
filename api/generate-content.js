// api/generate-content.js - FINAL DEBUG VERSION
// This will accept ANY field names and show exactly what's being received

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
    console.log('=== FINAL DEBUG - COMPLETE REQUEST ANALYSIS ===');
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const data = req.body || {};

    // Use the exact field names from your form
    const keyword = data.keyword || '';
    const sourceMaterial = data.sourceMaterial || '';
    const affiliateLink = data.affiliateLink || '';
    const wordCount = parseInt(data.wordCount) || 8000;
    const niche = data.publication || 'health';

    console.log('=== EXTRACTED VALUES ===');
    console.log('Keyword:', keyword);
    console.log('Source Material Length:', sourceMaterial.length);
    console.log('Source Material Preview:', sourceMaterial.substring(0, 200));
    console.log('Affiliate Link:', affiliateLink);
    console.log('Word Count:', wordCount);

    console.log('=== VALIDATION CHECK ===');
    console.log('Keyword found:', keyword);
    console.log('Source material length:', sourceMaterial.length);
    console.log('First 100 chars of source:', sourceMaterial.substring(0, 100));

    // Simple validation
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Keyword is required',
        receivedKeyword: keyword,
        debug: 'Keyword field is empty or invalid'
      });
    }

    if (!sourceMaterial || sourceMaterial.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Source material is too short or missing',
        sourceMaterialLength: sourceMaterial.length,
        sourceMaterialPreview: sourceMaterial.substring(0, 200),
        debug: 'Source material must be at least 10 characters'
      });
    }

    console.log('✅ Validation passed, generating content...');

    // Build comprehensive prompt based on your source material
    const prompt = `You are an expert content writer specializing in SEO-optimized articles with 100% factual accuracy.

CRITICAL INSTRUCTION: Create content based ONLY on the provided source material. Do NOT add information not supported by the source material.

SOURCE MATERIAL (YOUR FOUNDATION):
${sourceMaterial}

ARTICLE SPECIFICATIONS:
- Primary Keyword: "${keyword}"
- Target Word Count: ${wordCount} words minimum
- Style: Professional, SEO-optimized
- Niche: Health & Wellness Supplements

${affiliateLink ? `AFFILIATE LINK TO INTEGRATE: ${affiliateLink}` : ''}

MANDATORY STRUCTURE (Your Aggressive SEO Template):
1. **In This Article, You'll Discover:** (5-8 bullet points based on source material)
2. **TLDR Summary** (Focus keyword embedded, based on source material)
3. **Introduction** (Hook with focus keyword, using source facts)
4. **What are ${keyword}?** (Based on source material only)
5. **Key Benefits of ${keyword}** (Only benefits mentioned in source material)
6. **How ${keyword} Work** (Mechanism from source material)
7. **${keyword} Ingredients and Formula** (Based on source material)
8. **${keyword} vs Alternatives** (Only if mentioned in source material)
9. **How to Use ${keyword}** (Usage info from source material)
10. **Safety and Side Effects** (From source material + required disclaimers)
11. **Where to Buy ${keyword}** (Include affiliate link if provided)
12. **Frequently Asked Questions** (Based on source material)
13. **Conclusion**

FORMATTING REQUIREMENTS:
- **Bold all headings**
- **Bold important links**
- NO emojis - professional formatting only
- Target ${wordCount}+ words
- Include "${keyword}" naturally throughout (1-2% density)
- Use related terms from source material

REQUIRED DISCLAIMERS:
- Health: "This information is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before use."
- Pricing: "Prices subject to change. Check official website for current pricing."
- General: "Individual results may vary."

ACCURACY REQUIREMENTS:
- Use ONLY information from provided source material
- Expand thoroughly on each point from source material
- If source lacks info for a section, note "Based on available information..."
- Maintain 100% factual accuracy to source content

Create the complete article now, achieving ${wordCount}+ words by thoroughly explaining all concepts from the source material:`;

    const messages = [{ role: "user", content: prompt }];

    console.log('🤖 Calling Anthropic API...');

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
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Anthropic API error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Content generation failed',
        status: response.status,
        details: errorText.substring(0, 200)
      });
    }

    const result = await response.json();
    const content = result.content[0].text;
    const actualWordCount = content.split(' ').length;

    console.log('✅ Content generated successfully');
    console.log('📊 Word count:', actualWordCount);

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
    console.error('💥 Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}
