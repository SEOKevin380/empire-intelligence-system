// api/generate-content.js - SOURCE MATERIAL FOCUSED VERSION
// Replace your entire file with this code

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
    console.log('=== SOURCE MATERIAL FOCUSED CONTENT GENERATION ===');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const data = req.body || {};
    const keyword = data.keyword || data.topic || '';
    const sourceMaterial = data.sourceMaterial || data.source_material || '';
    const affiliateLink = data.affiliateLink || data.affiliate_link || '';
    const sourceUrl = data.sourceUrl || data.source_url || '';
    const niche = data.niche || 'general';
    const wordCount = data.wordCount || data.word_count || 4000;

    // CRITICAL: Require source material for accuracy
    if (!sourceMaterial) {
      return res.status(400).json({ 
        error: 'Source material is required',
        message: 'Please provide source material to ensure 100% factual accuracy'
      });
    }

    if (!keyword) {
      return res.status(400).json({ 
        error: 'Keyword/topic is required',
        message: 'Please provide a target keyword or topic'
      });
    }

    console.log(`Generating article about: ${keyword}`);
    console.log(`Using source material: ${sourceMaterial.substring(0, 100)}...`);

    // Build prompt that PRIORITIZES source material accuracy
    const prompt = `You are an expert content writer specializing in creating SEO-optimized articles with 100% factual accuracy based on provided source material.

CRITICAL REQUIREMENT: You MUST base your entire article on the SOURCE MATERIAL provided below. Do NOT add information that is not supported by the source material. Ensure 100% factual accuracy to the source content.

SOURCE MATERIAL (THIS IS YOUR FOUNDATION - BE 100% ACCURATE):
${sourceMaterial}

ARTICLE SPECIFICATIONS:
- Primary Focus Keyword: "${keyword}"
- Target Niche: ${niche}
- Target Word Count: ${wordCount} words minimum
- Format: Professional, SEO-optimized article

${affiliateLink ? `AFFILIATE LINK TO NATURALLY INTEGRATE: ${affiliateLink}` : ''}
${sourceUrl ? `SOURCE URL FOR ATTRIBUTION: ${sourceUrl}` : ''}

MANDATORY ARTICLE STRUCTURE:
1. **In This Article, You'll Discover:** (5-8 bullet points based on source material)
2. **TLDR Summary** (2-3 sentences summarizing key points from source material with focus keyword)
3. **Introduction** (engaging opening that introduces the topic using source material facts)
4. **What is ${keyword}?** (comprehensive explanation based ONLY on source material)
5. **Key Benefits of ${keyword}** (benefits mentioned in source material ONLY)
6. **How ${keyword} Works** (mechanism/process from source material)
7. **${keyword} Research and Studies** (any research mentioned in source material)
8. **${keyword} vs Alternatives** (comparisons only if mentioned in source material)
9. **How to Use ${keyword}** (usage information from source material)
10. **Potential Side Effects and Safety** (safety info from source material with disclaimers)
11. **Where to Buy ${keyword}** (include affiliate link if provided)
12. **Frequently Asked Questions** (FAQs based on source material)
13. **Final Thoughts**

FORMATTING REQUIREMENTS:
- Bold all headings with **text**
- Bold important terms and links
- NO emojis - professional formatting only
- Minimum ${wordCount} words
- Include focus keyword "${keyword}" naturally throughout (1-2% density)
- Use related terms from the source material as supporting keywords

ACCURACY REQUIREMENTS:
- Use ONLY information from the provided source material
- Do NOT add claims not supported by source material
- If source material lacks information for a section, state "Based on available information..." or similar
- Include appropriate disclaimers for health/medical claims
- Add pricing disclaimers where applicable

DISCLAIMERS TO INCLUDE:
- Health/Medical: "This information is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before starting any new supplement or health regimen."
- Pricing: "Prices are subject to change. Please check the official website for current pricing information."
- General: "The information in this article is based on available research and should not replace professional advice."

SEO OPTIMIZATION:
- Natural integration of focus keyword throughout content
- Use semantic variations and related terms from source material
- Include internal linking opportunities where relevant
- Create engaging, click-worthy headings while maintaining accuracy

Create a comprehensive, SEO-optimized article that expands upon the source material while maintaining 100% factual accuracy. Achieve the target word count by thoroughly explaining the concepts from the source material, providing detailed coverage of each point, and ensuring comprehensive exploration of all aspects mentioned in the source content.

Begin writing the complete article now:`;

    const messages = [{ role: "user", content: prompt }];

    console.log('Calling Anthropic API with source-focused prompt...');

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
        temperature: 0.2 // Lower temperature for more factual, accurate content
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Content generation failed',
        status: response.status,
        details: errorText.substring(0, 200)
      });
    }

    const result = await response.json();
    const content = result.content[0].text;
    const actualWordCount = content.split(' ').length;

    // Quality checks focused on source material usage
    const qualityChecks = {
      hasInThisArticle: content.includes('In This Article, You\'ll Discover:'),
      hasTLDR: content.includes('TLDR') || content.includes('TL;DR'),
      hasKeyword: content.toLowerCase().includes(keyword.toLowerCase()),
      hasBoldHeadings: content.includes('**'),
      meetWordCount: actualWordCount >= (wordCount * 0.8),
      hasDisclaimers: content.includes('not intended to diagnose') || content.includes('Consult with a healthcare')
    };

    const qualityScore = (Object.values(qualityChecks).filter(Boolean).length / Object.values(qualityChecks).length) * 100;

    console.log(`Content generated - Word count: ${actualWordCount}, Quality: ${qualityScore.toFixed(1)}%`);

    return res.status(200).json({
      success: true,
      content: content,
      qualityAssurance: {
        wordCount: actualWordCount,
        targetWordCount: wordCount,
        qualityScore: qualityScore.toFixed(1) + '%',
        checks: qualityChecks,
        sourceBasedGeneration: true
      },
      metadata: {
        keyword: keyword,
        niche: niche,
        sourceMaterialLength: sourceMaterial.length,
        hasAffiliateLink: !!affiliateLink,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
