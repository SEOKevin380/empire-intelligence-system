// Enhanced SEO Expert Serverless Function - /api/generate-content.js
// Empire Intelligence System V16.0 - Production SEO Optimization

export default async function handler(req, res) {
  // CORS headers for cross-origin requests
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
    const { niche, product, keywords, modelTier, targetUrl } = req.body;

    if (!niche || !product || !keywords) {
      return res.status(400).json({ 
        error: 'Missing required fields: niche, product, keywords' 
      });
    }

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

    const selectedModel = modelConfig[modelTier] || modelConfig['standard'];

    // Enhanced SEO Expert Content Generation Prompt with CRITICAL Quality Enforcement
    const contentPrompt = `You are the world's foremost SEO content optimization expert. You MUST generate a comprehensive article that meets ALL specifications below. Failure to meet ANY requirement will result in content rejection.

**NON-NEGOTIABLE SEO REQUIREMENTS:**
- MANDATORY H1 Title: Start article with "# [SEO Title Here]" containing "${keywords}" (50-60 chars)
- ABSOLUTE Word Count: MINIMUM ${selectedModel.targetWords} words - count every single word
- Precise Heading Structure: Exactly 8+ H2 sections (##), 15+ H3 subsections (###)
- Affiliate Link Integration: Exactly 5-7 masked links using ${targetUrl || 'https://example-affiliate-link.com'}
- Mandatory Formatting: Minimum 15 **bold phrases**, 20+ bullet points (-)
- Keyword Optimization: "${keywords}" density 1.5-2.5%, natural integration

**NICHE-SPECIFIC DETAILS:**
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
- Use these exact anchor text variations:
  1. "[check current prices and availability](${targetUrl || 'https://example-affiliate-link.com'})"
  2. "[see verified customer reviews](${targetUrl || 'https://example-affiliate-link.com'})"  
  3. "[get exclusive discount here](${targetUrl || 'https://example-affiliate-link.com'})"
  4. "[shop authentic ${product}](${targetUrl || 'https://example-affiliate-link.com'})"
  5. "[compare pricing options](${targetUrl || 'https://example-affiliate-link.com'})"
  6. "[secure your supply today](${targetUrl || 'https://example-affiliate-link.com'})"
  7. "[view latest deals](${targetUrl || 'https://example-affiliate-link.com'})"

**FORMATTING STANDARDS:**
- Bold important phrases, product names, key benefits
- Use bullet points for features, benefits, pros/cons
- Include numbered lists for steps, tips, guidelines
- Add comparison tables where relevant
- Ensure proper paragraph breaks for readability

**COMPLIANCE & QUALITY:**
- Include FTC affiliate disclosure
- YMYL medical disclaimers for health content
- Evidence-based claims with authoritative tone
- Professional, trustworthy voice throughout
- No exaggerated claims or false promises

**NICHE-SPECIFIC OPTIMIZATION:**
${getNicheSpecificGuidance(niche)}

Generate the complete article now, ensuring every requirement is met. Focus on delivering exceptional value while maintaining commercial intent. The content must exceed ${selectedModel.targetWords} words and include all specified elements.`;

    // Generate content using Claude API
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
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API request failed: ${response.status}`);
    }

    const data = await response.json();
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
      estimatedCost: selectedModel.cost,
      wordCount: qualityAnalysis.wordCount,
      complianceStatus: qualityAnalysis.compliance,
      optimizationSuggestions: qualityAnalysis.suggestions
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ 
      error: 'Content generation failed', 
      details: error.message 
    });
  }
}

// Niche-specific optimization guidance
function getNicheSpecificGuidance(niche) {
  const nicheGuides = {
    'Health & Supplements': `
- Focus on evidence-based benefits, clinical studies, ingredient analysis
- Include dosage recommendations, safety profiles, FDA disclaimers
- Address common health concerns and lifestyle integration
- Compare with similar supplements in market
- Emphasize quality, purity, third-party testing`,
    
    'Technology': `
- Technical specifications, performance benchmarks, compatibility
- User experience analysis, interface design, feature comparisons  
- Integration capabilities, scalability, security considerations
- Price-performance ratios, ROI analysis, implementation costs
- Future-proofing and update policies`,
    
    'Finance': `
- Risk analysis, regulatory compliance, fee structures
- Performance tracking, ROI calculations, market comparisons
- User security, data protection, customer support quality
- Integration with existing financial tools and platforms
- Long-term value proposition and growth potential`,
    
    'E-commerce': `
- Product quality analysis, shipping and return policies
- Customer service evaluation, warranty information
- Price competitiveness, value proposition analysis
- User reviews synthesis, brand reputation assessment
- Integration with popular platforms and payment methods`
  };

  return nicheGuides[niche] || nicheGuides['Health & Supplements'];
}

// Advanced SEO Quality Validation System
function performAdvancedSEOValidation(content, keywords, targetWords, product) {
  const analysis = {
    wordCount: content.split(/\s+/).length,
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
  const bulletCount = (content.match(/^[\s]*[-*+]\s+/gm) || []).length;
  analysis.breakdown.formatting = {
    score: (boldCount >= 15 && bulletCount >= 20) ? 100 : Math.min(90, (boldCount * 3) + (bulletCount * 2)),
    details: `${boldCount} bold phrases, ${bulletCount} bullet points`,
    requirement: '15+ bold phrases, 20+ bullet points, numbered lists'
  };

  // Keyword Density Analysis
  const keywordRegex = new RegExp(keywords.replace(/\s+/g, '\\s+'), 'gi');
  const keywordMatches = (content.match(keywordRegex) || []).length;
  const keywordDensity = (keywordMatches / analysis.wordCount * 100).toFixed(2);
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
  analysis.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

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
