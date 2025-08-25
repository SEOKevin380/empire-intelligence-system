// FIXED - Enhanced SEO Expert Serverless Function - /api/generate-content.js
// Empire Intelligence System V16.1 - Production SEO Optimization (400 Error Fix)

export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { niche, product, keywords, modelTier, targetUrl } = req.body;

    // Enhanced input validation with detailed error messages
    if (!niche || !product || !keywords) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          niche: !niche ? 'Required' : 'OK',
          product: !product ? 'Required' : 'OK', 
          keywords: !keywords ? 'Required' : 'OK'
        }
      });
    }

    // Validate modelTier
    const validTiers = ['efficient', 'standard', 'premium'];
    const selectedTier = modelTier && validTiers.includes(modelTier) ? modelTier : 'standard';

    // Model configuration with SEO optimization focus
    const modelConfig = {
      'efficient': {
        model: 'claude-3-haiku-20240307',
        maxTokens: 2000,
        targetWords: 1200,
        cost: 0.06
      },
      'standard': {
        model: 'claude-3-sonnet-20240229', 
        maxTokens: 3000,
        targetWords: 2200,
        cost: 0.15
      },
      'premium': {
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 4000,
        targetWords: 3200,
        cost: 0.40
      }
    };

    const selectedModel = modelConfig[selectedTier];

    // Enhanced SEO Expert Content Generation Prompt with CRITICAL Quality Enforcement
    const contentPrompt = `You are the world's foremost SEO content optimization expert. You MUST generate a comprehensive article that meets ALL specifications below. 

**NON-NEGOTIABLE SEO REQUIREMENTS:**
- MANDATORY H1 Title: Start article with "# [SEO Title Here]" containing "${keywords}" (50-60 chars)
- ABSOLUTE Word Count: MINIMUM ${selectedModel.targetWords} words - count every single word
- Precise Heading Structure: Exactly 8+ H2 sections (##), 15+ H3 subsections (###)
- Affiliate Link Integration: Exactly 5-7 masked links using ${targetUrl || 'https://example-affiliate-link.com'}
- Mandatory Formatting: Minimum 15 **bold phrases**, 20+ bullet points (-)
- Keyword Optimization: "${keywords}" density 1.5-2.5%, natural integration

**PRODUCT DETAILS:**
- Niche: ${niche}
- Product Focus: ${product}
- Primary Keywords: ${keywords}
- Target URL: ${targetUrl || 'https://example-affiliate-link.com'}

**EXACT ARTICLE STRUCTURE - FOLLOW PRECISELY:**

# [Your SEO-Optimized H1 Title with "${keywords}" - 50-60 characters]

[Introduction paragraph with hook and benefit preview - 150+ words]

## What is ${product}? Complete Overview
### Understanding ${product} Fundamentals
### Key Ingredients and Composition  
### How ${product} Differs from Alternatives

## Top Benefits and Features of ${product}
### Primary Health Benefits
- [Bullet point 1]
- [Bullet point 2] 
- [Bullet point 3]
### Secondary Advantages
### Long-term Benefits

## How ${product} Works in Your Body
### Mechanism of Action
### Absorption and Bioavailability
### Timeline of Effects

## Clinical Research and Scientific Studies
### Published Research Findings
### Clinical Trial Results
### Expert Medical Opinions

## Real User Reviews and Testimonials
### Verified Customer Experiences
### Success Stories and Case Studies
### Common User Feedback Themes

## Proper Dosage and Usage Guidelines
### Recommended Dosing Protocol
### Best Time to Take
### Duration of Use

## Potential Side Effects and Safety Profile
### Common Side Effects
### Who Should Avoid This Product
### Safety Precautions and Warnings

## ${product} vs Competitors: Detailed Comparison
### Price Comparison Analysis
### Feature and Benefit Comparison
### Quality and Purity Standards

## Where to Buy ${product} - Best Deals Available
### Official Retailer Information
### Current Pricing and Discounts
### Shipping and Return Policies

## Frequently Asked Questions About ${product}
### What makes ${product} different from other supplements?
### How long does it take to see results with ${product}?
### Can I take ${product} with other supplements?
### Is ${product} safe for long-term use?
### What if ${product} doesn't work for me?
### How should I store ${product}?
### Are there any dietary restrictions with ${product}?
### What's the best time of day to take ${product}?

## Conclusion and Final Recommendation
[Compelling summary with strong call-to-action]

**AFFILIATE LINK INTEGRATION REQUIREMENTS:**
Use these exact anchor text variations:
1. "[check current prices and availability](${targetUrl || 'https://example-affiliate-link.com'})"
2. "[see verified customer reviews](${targetUrl || 'https://example-affiliate-link.com'})"
3. "[get exclusive discount here](${targetUrl || 'https://example-affiliate-link.com'})"
4. "[shop authentic ${product}](${targetUrl || 'https://example-affiliate-link.com'})"
5. "[compare pricing options](${targetUrl || 'https://example-affiliate-link.com'})"
6. "[secure your supply today](${targetUrl || 'https://example-affiliate-link.com'})"
7. "[view latest deals](${targetUrl || 'https://example-affiliate-link.com'})"

**CRITICAL FORMATTING ENFORCEMENT:**
- Every important phrase, product name, and key benefit MUST be **bolded**
- Use bullet points (-) for ALL lists, features, benefits, pros/cons
- Include numbered lists (1., 2., 3.) for steps, procedures, rankings
- Bold the first instance of ${product} in each major section

**COMPLIANCE REQUIREMENTS:**
- Include FTC disclosure: "This article contains affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you."
- Add health disclaimer: "This product has not been evaluated by the FDA. It is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use."

Write the complete article now. Every requirement must be met. Count your words to exceed ${selectedModel.targetWords} words.`;

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'API key not configured'
      });
    }

    // Generate content using Claude API with corrected headers
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: selectedModel.model,
        max_tokens: selectedModel.maxTokens,
        messages: [
          {
            role: 'user',
            content: contentPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API Error:', response.status, errorData);
      return res.status(500).json({ 
        error: 'Claude API request failed',
        status: response.status,
        details: errorData
      });
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      return res.status(500).json({
        error: 'Invalid response from Claude API',
        response: data
      });
    }

    const content = data.content[0].text;

    // Enhanced SEO Quality Validation
    const qualityAnalysis = performAdvancedSEOValidation(content, keywords, selectedModel.targetWords, product);

    // Return enhanced response with detailed quality metrics
    return res.status(200).json({
      content,
      qualityScore: qualityAnalysis.overallScore,
      qualityBreakdown: qualityAnalysis.breakdown,
      seoMetrics: qualityAnalysis.seoMetrics,
      modelUsed: selectedModel.model,
      modelTier: selectedTier,
      estimatedCost: selectedModel.cost,
      wordCount: qualityAnalysis.wordCount,
      complianceStatus: qualityAnalysis.compliance,
      optimizationSuggestions: qualityAnalysis.suggestions
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ 
      error: 'Content generation failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Advanced SEO Quality Validation System
function performAdvancedSEOValidation(content, keywords, targetWords, product) {
  const analysis = {
    wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
    breakdown: {},
    seoMetrics: {},
    compliance: {},
    suggestions: []
  };

  // H1 Title Validation
  const h1Match = content.match(/^#\s+(.+?)(?:\n|$)/m);
  analysis.breakdown.h1Title = {
    score: h1Match && h1Match[1].toLowerCase().includes(keywords.toLowerCase()) ? 95 : 20,
    details: h1Match ? `H1 found: "${h1Match[1]}"` : 'Missing H1 title',
    requirement: 'SEO-optimized H1 with target keyword (50-60 chars)'
  };

  // Word Count Validation
  analysis.breakdown.wordCount = {
    score: analysis.wordCount >= targetWords ? 100 : Math.round((analysis.wordCount / targetWords) * 100),
    details: `${analysis.wordCount} words (target: ${targetWords}+)`,
    requirement: `Minimum ${targetWords} words for premium content`
  };

  // Heading Structure Validation
  const h2Count = (content.match(/^##\s+/gm) || []).length;
  const h3Count = (content.match(/^###\s+/gm) || []).length;
  analysis.breakdown.headingStructure = {
    score: (h2Count >= 8 && h3Count >= 15) ? 100 : Math.min(90, (h2Count * 8) + (h3Count * 2)),
    details: `${h2Count} H2 headings, ${h3Count} H3 headings`,
    requirement: '8+ H2 sections, 15+ H3 subsections'
  };

  // Affiliate Link Validation
  const linkCount = (content.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
  analysis.breakdown.affiliateLinks = {
    score: linkCount >= 5 ? 100 : (linkCount * 20),
    details: `${linkCount} affiliate links found`,
    requirement: '5-7 contextual affiliate links with varied anchor text'
  };

  // Formatting Validation
  const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
  const bulletCount = (content.match(/^[\s]*-\s+/gm) || []).length;
  analysis.breakdown.formatting = {
    score: (boldCount >= 15 && bulletCount >= 20) ? 100 : Math.min(90, (boldCount * 3) + (bulletCount * 2)),
    details: `${boldCount} bold phrases, ${bulletCount} bullet points`,
    requirement: '15+ bold phrases, 20+ bullet points, numbered lists'
  };

  // Keyword Density Analysis
  const keywordRegex = new RegExp(keywords.replace(/\s+/g, '\\s+'), 'gi');
  const keywordMatches = (content.match(keywordRegex) || []).length;
  const keywordDensity = analysis.wordCount > 0 ? (keywordMatches / analysis.wordCount * 100).toFixed(2) : 0;
  analysis.seoMetrics.keywordDensity = {
    density: `${keywordDensity}%`,
    occurrences: keywordMatches,
    optimal: keywordDensity >= 1.5 && keywordDensity <= 2.5
  };

  // FAQ Section Validation
  const faqSection = content.toLowerCase().includes('frequently asked questions') || 
                     content.toLowerCase().includes('faq');
  const specificProduct = content.toLowerCase().includes(product.toLowerCase());
  analysis.breakdown.faqQuality = {
    score: (faqSection && specificProduct) ? 100 : 40,
    details: faqSection ? 'FAQ section present' : 'Missing FAQ section',
    requirement: `FAQ section with ${product}-specific questions`
  };

  // Compliance Validation
  const hasDisclaimer = content.toLowerCase().includes('affiliate') || 
                       content.toLowerCase().includes('commission');
  const hasHealthDisclaimer = content.toLowerCase().includes('disclaimer') ||
                             content.toLowerCase().includes('consult');
  
  analysis.compliance = {
    affiliateDisclosure: hasDisclaimer,
    healthDisclaimer: hasHealthDisclaimer,
    overallCompliance: hasDisclaimer && hasHealthDisclaimer
  };

  // Calculate Overall Score
  const scores = Object.values(analysis.breakdown).map(item => item.score);
  analysis.overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Generate Optimization Suggestions
  if (analysis.breakdown.h1Title.score < 90) {
    analysis.suggestions.push('Add SEO-optimized H1 title with target keyword');
  }
  if (analysis.breakdown.wordCount.score < 90) {
    analysis.suggestions.push(`Increase word count to minimum ${targetWords} words`);
  }
  if (analysis.breakdown.affiliateLinks.score < 90) {
    analysis.suggestions.push('Add more contextual affiliate links (5-7 recommended)');
  }
  if (analysis.breakdown.formatting.score < 90) {
    analysis.suggestions.push('Enhance formatting with more bold text and bullet points');
  }
  if (!analysis.seoMetrics.keywordDensity.optimal) {
    analysis.suggestions.push('Optimize keyword density to 1.5-2.5% range');
  }

  return analysis;
}
