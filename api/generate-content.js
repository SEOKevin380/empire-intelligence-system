// api/generate-content.js - ENHANCED VERSION WITH SEO COMPLIANCE
// Replace your entire existing file with this code

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
    console.log('=== ENHANCED SEO CONTENT GENERATION ===');
    console.log('Request data:', JSON.stringify(req.body, null, 2));

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract and validate required fields
    const {
      keyword,
      topic,
      niche,
      contentType,
      platform,
      sourceMaterial,
      affiliateLink,
      sourceUrl,
      wordCount = 4000,
      targetAudience = 'general audience'
    } = req.body || {};

    const contentData = {
      focusKeyword: keyword || topic,
      niche: niche || 'general',
      contentType: contentType || 'article',
      platform: platform || 'website',
      sourceMaterial: sourceMaterial || '',
      affiliateLink: affiliateLink || '',
      sourceUrl: sourceUrl || '',
      targetWordCount: parseInt(wordCount) || 4000,
      targetAudience
    };

    // Validate critical fields
    if (!contentData.focusKeyword) {
      return res.status(400).json({ 
        error: 'Missing required field: keyword/topic is required' 
      });
    }

    console.log('✅ Processing SEO-optimized content for:', contentData.focusKeyword);

    // Build comprehensive SEO-focused prompt
    const seoPrompt = `You are the world's foremost expert content creator and aggressive SEO strategist. Create a comprehensive, SEO-optimized article following these EXACT specifications:

MANDATORY REQUIREMENTS:
- Target word count: ${contentData.targetWordCount} words minimum
- Focus keyword: "${contentData.focusKeyword}"
- Niche: ${contentData.niche}
- Content type: ${contentData.contentType}
- Target platform: ${contentData.platform}
- Target audience: ${contentData.targetAudience}

${contentData.sourceMaterial ? `SOURCE MATERIAL (MUST BE 100% ACCURATE):
${contentData.sourceMaterial}

CRITICAL: Ensure complete factual accuracy to the source material above.` : ''}

${contentData.affiliateLink ? `AFFILIATE LINK TO INTEGRATE: ${contentData.affiliateLink}` : ''}
${contentData.sourceUrl ? `SOURCE URL FOR REFERENCE: ${contentData.sourceUrl}` : ''}

AGGRESSIVE SEO TEMPLATE STRUCTURE (MANDATORY):

**GOAL 1:** Intent of article is to rank in search for "${contentData.focusKeyword}" focus keywords
**GOAL 2:** Intent of article is to convert readers to buy "${contentData.focusKeyword}" so we monetize our article
**GOAL 3:** Structure articles in the most aggressive SEO format, guiding readers from pain point to pain-free experience
**GOAL 4:** Ensure all fact-checking processes so content is 100% factually correct

MANDATORY FORMATTING REQUIREMENTS:
1. Start with "In This Article, You'll Discover:" bullet points for intro
2. Include TLDR summary with focus keywords embedded
3. Bold ALL headings and links
4. No emojis - clean and professional formatting only
5. Add disclaimers for borderline medical claims
6. Include pricing disclaimers where applicable
7. Adhere to YMYL, FTC, and compliance regulations
8. Embed focus keywords naturally throughout (avoid keyword stuffing)
9. Include semantic LSI keywords related to the main focus keyword
10. Create compelling, conversion-focused content that drives action

ARTICLE STRUCTURE TEMPLATE:
1. **In This Article, You'll Discover:** (bullet points)
2. **TLDR Summary** (focus keywords embedded)
3. **Introduction** (hook with focus keywords)
4. **[Focus Keyword] Overview** (comprehensive explanation)
5. **Benefits of [Focus Keyword]** (detailed benefits section)
6. **How [Focus Keyword] Works** (mechanism/process)
7. **[Focus Keyword] vs Alternatives** (comparison section)
8. **Choosing the Right [Focus Keyword]** (buying guide/selection criteria)
9. **[Focus Keyword] Dosage/Usage Guidelines** (if applicable)
10. **Potential Side Effects and Safety** (with appropriate disclaimers)
11. **Real User Reviews and Testimonials** 
12. **Where to Buy [Focus Keyword]** (include affiliate links if provided)
13. **Frequently Asked Questions**
14. **Final Thoughts and Recommendations**

QUALITY ASSURANCE REQUIREMENTS:
- Minimum ${contentData.targetWordCount} words
- Natural keyword density (1-2% for focus keyword)
- Include 5-10 related LSI keywords
- Add internal linking opportunities
- Include conversion-focused calls to action
- Ensure readability score of 60+ (Flesch-Kincaid)
- Add appropriate disclaimers for health/financial claims
- Include source citations where applicable

COMPLIANCE REQUIREMENTS:
- Add medical disclaimers: "This information is not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before starting any new supplement regimen."
- Add pricing disclaimers: "Prices are subject to change. Please check the official website for the most current pricing information."
- Follow FTC guidelines for affiliate link disclosure
- Ensure YMYL compliance for health/financial topics

CONVERSION OPTIMIZATION:
- Include compelling headlines and subheadings
- Add urgency and scarcity elements where appropriate
- Create clear calls to action throughout
- Highlight unique selling propositions
- Address common objections and concerns
- Include social proof and testimonials

Now create the complete, SEO-optimized article following ALL requirements above. Ensure it meets the minimum word count and includes all mandatory elements.`;

    const messages = [{ role: "user", content: seoPrompt }];

    console.log('🤖 Generating SEO-optimized content...');
    console.log('📏 Target word count:', contentData.targetWordCount);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000, // Increased for longer content
        messages: messages,
        temperature: 0.3 // Lower temperature for more focused, factual content
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Anthropic API Error:', errorData);
      return res.status(response.status).json({ 
        error: `Content generation failed: ${response.status}`,
        details: errorData.substring(0, 200)
      });
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;
    
    // QUALITY ASSURANCE CHECKS
    const wordCount = generatedContent.split(' ').length;
    const hasRequiredSections = {
      inThisArticle: generatedContent.includes('In This Article, You\'ll Discover:'),
      tldrSummary: generatedContent.includes('TLDR') || generatedContent.includes('TL;DR'),
      focusKeywordInTitle: generatedContent.toLowerCase().includes(contentData.focusKeyword.toLowerCase()),
      boldHeadings: generatedContent.includes('**'),
      appropriateLength: wordCount >= (contentData.targetWordCount * 0.8) // Allow 20% variance
    };

    console.log('📊 Quality Assessment:');
    console.log('Word count:', wordCount, '/ Target:', contentData.targetWordCount);
    console.log('QA Checks:', hasRequiredSections);

    // Calculate quality score
    const qualityChecks = Object.values(hasRequiredSections);
    const qualityScore = (qualityChecks.filter(Boolean).length / qualityChecks.length) * 100;

    console.log('📈 Quality Score:', qualityScore.toFixed(1) + '%');

    // Warn if quality thresholds not met
    const warnings = [];
    if (wordCount < contentData.targetWordCount * 0.8) {
      warnings.push(`Word count below target: ${wordCount} / ${contentData.targetWordCount}`);
    }
    if (!hasRequiredSections.inThisArticle) {
      warnings.push('Missing "In This Article, You\'ll Discover" section');
    }
    if (!hasRequiredSections.tldrSummary) {
      warnings.push('Missing TLDR summary section');
    }
    if (qualityScore < 80) {
      warnings.push('Quality score below 80%');
    }

    const successResponse = {
      success: true,
      content: generatedContent,
      qualityAssurance: {
        wordCount: wordCount,
        targetWordCount: contentData.targetWordCount,
        qualityScore: qualityScore,
        seoChecks: hasRequiredSections,
        warnings: warnings,
        focusKeyword: contentData.focusKeyword,
        niche: contentData.niche,
        platform: contentData.platform
      },
      metadata: {
        model: "claude-sonnet-4-20250514",
        generatedAt: new Date().toISOString(),
        usage: data.usage
      }
    };

    console.log('✅ Content generation completed');
    console.log('⚠️  Warnings:', warnings.length);
    
    res.status(200).json(successResponse);

  } catch (error) {
    console.error('💥 Error in enhanced content generation:', error);
    res.status(500).json({ 
      error: 'Content generation failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
