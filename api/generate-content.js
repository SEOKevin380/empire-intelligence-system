// Complete SEO Content Generation Function - /api/generate-content.js
// Empire Intelligence System V16.1 - Full Production Version

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'EMPIRE_INTELLIGENCE_ONLINE',
      message: 'SEO content generation API ready',
      timestamp: new Date().toISOString(),
      version: 'V16.1',
      endpoints: {
        health: 'GET /api/generate-content',
        generate: 'POST /api/generate-content'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['GET', 'POST']
    });
  }

  try {
    // Input validation
    const { niche, product, keywords, modelTier = 'standard', targetUrl } = req.body || {};

    if (!niche || !product || !keywords) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['niche', 'product', 'keywords'],
        optional: ['modelTier', 'targetUrl'],
        received: { niche: !!niche, product: !!product, keywords: !!keywords }
      });
    }

    // Model configuration
    const models = {
      efficient: { 
        model: 'claude-3-haiku-20240307', 
        maxTokens: 2500, 
        targetWords: 1200, 
        cost: 0.06 
      },
      standard: { 
        model: 'claude-3-sonnet-20240229', 
        maxTokens: 3500, 
        targetWords: 2200, 
        cost: 0.15 
      },
      premium: { 
        model: 'claude-3-5-sonnet-20241022', 
        maxTokens: 4000, 
        targetWords: 3200, 
        cost: 0.40 
      }
    };

    const selectedModel = models[modelTier] || models.standard;

    // API key validation
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    // Enhanced SEO content prompt
    const prompt = `You are the world's leading SEO content specialist. Create a comprehensive ${selectedModel.targetWords}-word article about "${product}" in the ${niche} niche that ranks #1 on Google.

**CRITICAL SEO REQUIREMENTS:**
- Start with H1 title containing "${keywords}" (50-60 characters)
- Target exactly ${selectedModel.targetWords}+ words
- Include 8+ H2 sections, 15+ H3 subsections
- Add 5+ affiliate links using: ${targetUrl || 'https://example.com/product'}
- Use 15+ bold phrases (**text**)
- Include 20+ bullet points (-)
- FAQ section with 8+ product-specific questions

**MANDATORY ARTICLE STRUCTURE:**

# [SEO Title with "${keywords}" - 50-60 characters]

**${product}** has emerged as one of the most sought-after solutions in the ${niche} market. This comprehensive guide explores everything you need to know about **${product}**, including its benefits, usage, reviews, and where to find the best deals.

## What is ${product}? Complete Overview

**${product}** is a premium solution designed specifically for ${niche} needs. Key characteristics include:

- Advanced formulation with proven ingredients
- Clinical backing and research support  
- Superior quality and purity standards
- Trusted by thousands of satisfied customers

### Understanding ${product} Fundamentals

The science behind **${product}** revolves around its unique approach to addressing ${niche} concerns. Unlike generic alternatives, **${product}** offers targeted benefits that deliver measurable results.

### Key Ingredients and Composition

**${product}** contains carefully selected components that work synergistically:

- Primary active compounds for maximum effectiveness
- Supporting ingredients for enhanced absorption
- Natural elements for safety and tolerability
- Quality-tested materials from trusted suppliers

## Top Benefits and Features of ${product}

**${product}** delivers multiple advantages for ${niche} applications:

### Primary Health Benefits

- **Enhanced Performance**: Significant improvement in targeted areas
- **Fast-Acting Results**: Noticeable effects within recommended timeframe  
- **Long-Term Value**: Sustained benefits with consistent use
- **Safety Profile**: Minimal side effects when used as directed
- **Quality Assurance**: Third-party tested for purity and potency

### Secondary Advantages

- Easy integration into daily routine
- Flexible dosing options for individual needs
- Excellent customer support and guidance
- Money-back satisfaction guarantee

[Check current prices and availability](${targetUrl || 'https://example.com/product'}) for exclusive deals.

## How ${product} Works in Your Body

### Mechanism of Action

**${product}** operates through multiple pathways to deliver comprehensive benefits. The active ingredients target specific receptors and biological processes to optimize ${niche} function.

### Absorption and Bioavailability

The advanced formulation ensures optimal absorption:

- Rapid uptake within 30-60 minutes
- Enhanced bioavailability through specialized delivery
- Minimal waste with maximum utilization
- Consistent blood levels for sustained effects

## Clinical Research and Scientific Studies

### Published Research Findings

Multiple peer-reviewed studies support **${product}**'s effectiveness:

- Clinical trials demonstrating significant improvements
- Comparative studies showing superior results
- Long-term safety data from extended use
- Mechanism of action research validating the approach

### Expert Medical Opinions

Leading specialists in ${niche} recommend **${product}** for:

- Individuals seeking proven solutions
- Those who have tried other approaches without success
- People looking for evidence-based options
- Users prioritizing safety and quality

## Real User Reviews and Testimonials

### Verified Customer Experiences

Thousands of users report positive outcomes with **${product}**:

- **95% satisfaction rate** in customer surveys
- **Average 4.8/5 star rating** across review platforms
- **90% would recommend** to friends and family
- **85% experienced results** within 30 days

### Success Stories and Case Studies

Real users share their **${product}** journey:

- Significant improvements in targeted areas
- Enhanced quality of life and daily function
- Successful long-term maintenance of benefits
- Positive impact on overall well-being

[See verified customer reviews](${targetUrl || 'https://example.com/product'}) from actual users.

## Proper Dosage and Usage Guidelines

### Recommended Dosing Protocol

**${product}** should be used according to these guidelines:

1. **Starting Dose**: Begin with manufacturer's recommended amount
2. **Timing**: Take with or without food as specified
3. **Frequency**: Follow daily dosing schedule consistently
4. **Duration**: Allow 30-60 days for optimal results
5. **Adjustments**: Modify dose only under professional guidance

### Best Practices for Maximum Benefits

- Maintain consistent daily usage
- Store in cool, dry location
- Avoid interactions with specified substances
- Monitor progress and adjust as needed
- Consult healthcare provider before starting

## Potential Side Effects and Safety Profile

### Common Side Effects

**${product}** is generally well-tolerated, but some users may experience:

- Mild digestive adjustments initially
- Temporary changes in sleep patterns
- Minor headaches during adaptation period
- Slight energy level fluctuations

### Who Should Avoid This Product

**${product}** may not be suitable for:

- Pregnant or nursing women
- Individuals under 18 years of age
- People with specific medical conditions
- Those taking certain medications

### Safety Precautions and Warnings

- Consult healthcare provider before use
- Start with lowest effective dose
- Monitor for adverse reactions
- Discontinue if severe side effects occur
- Keep out of reach of children

## ${product} vs Competitors: Detailed Comparison

### Price Comparison Analysis

**${product}** offers exceptional value compared to alternatives:

- **Cost per serving**: Competitive pricing with superior quality
- **Monthly investment**: Reasonable cost for premium benefits
- **Value proposition**: Better results justify price difference
- **Bulk discounts**: Additional savings for larger orders

[Compare pricing options](${targetUrl || 'https://example.com/product'}) to find the best deals.

### Feature and Benefit Comparison

**${product}** outperforms competitors in key areas:

- Higher potency active ingredients
- Better absorption and bioavailability
- More comprehensive research backing
- Superior customer satisfaction ratings
- Stronger quality assurance standards

## Where to Buy ${product} - Best Deals Available

### Official Retailer Information

For authentic **${product}**, purchase only from authorized sources:

- Official manufacturer website
- Verified retail partners
- Licensed healthcare providers
- Authorized online marketplaces

### Current Pricing and Discounts

**${product}** offers several purchasing options:

- **Single bottle**: Perfect for first-time users
- **3-bottle pack**: Most popular option with savings
- **6-bottle bundle**: Maximum savings for long-term users
- **Subscription service**: Convenient automatic delivery

[Get exclusive discount here](${targetUrl || 'https://example.com/product'}) - limited time offer!

### Shipping and Return Policies

- **Fast shipping**: 2-3 business day delivery available
- **Free shipping**: On orders over specified amount
- **Money-back guarantee**: 60-90 day satisfaction guarantee
- **Easy returns**: Hassle-free return process

## Frequently Asked Questions About ${product}

### What makes ${product} different from other supplements?

**${product}** stands out due to its unique formulation, clinical research backing, and superior quality standards. The combination of potent ingredients and advanced delivery system provides better results than generic alternatives.

### How long does it take to see results with ${product}?

Most users notice initial improvements within 7-14 days, with significant benefits becoming apparent after 30-60 days of consistent use. Individual results may vary based on personal factors and adherence to recommended usage.

### Can I take ${product} with other supplements?

**${product}** can generally be used alongside most other supplements, but it's recommended to consult with a healthcare provider to ensure there are no potential interactions with your specific supplement regimen.

### Is ${product} safe for long-term use?

Clinical studies and user data suggest **${product}** is safe for extended use when taken as directed. The natural ingredient profile and extensive testing support its long-term safety profile.

### What if ${product} doesn't work for me?

**${product}** comes with a satisfaction guarantee. If you don't experience the expected benefits within the specified timeframe, you can return the product for a full refund according to the return policy.

### How should I store ${product}?

Store **${product}** in a cool, dry place away from direct sunlight and heat. Keep the container tightly sealed and out of reach of children. Proper storage ensures maximum potency and shelf life.

### Are there any dietary restrictions with ${product}?

**${product}** is compatible with most dietary preferences, but individuals with specific allergies or dietary restrictions should review the ingredient list carefully and consult with a healthcare provider if needed.

### What's the best time of day to take ${product}?

The optimal timing for **${product}** depends on individual preferences and lifestyle. Many users prefer taking it in the morning for all-day benefits, while others find evening use more convenient. Consistency is more important than specific timing.

## Conclusion and Final Recommendation

**${product}** represents a breakthrough solution in the ${niche} market, combining scientific innovation with practical effectiveness. The comprehensive research backing, positive user experiences, and superior quality standards make it an excellent choice for individuals seeking proven results.

Key advantages of **${product}** include:

- **Clinically proven effectiveness** in addressing ${niche} needs
- **Premium quality ingredients** for maximum potency and safety
- **Excellent user satisfaction** with 95% positive reviews
- **Comprehensive support** with money-back guarantee
- **Competitive pricing** with bulk discount options

For those serious about achieving their ${niche} goals, **${product}** offers the scientific backing, quality assurance, and proven track record necessary for success.

[Secure your supply today](${targetUrl || 'https://example.com/product'}) and experience the **${product}** difference for yourself.

**Disclaimer**: This article contains affiliate links. We may earn a commission if you make a purchase through these links at no extra cost to you. This product has not been evaluated by the FDA. It is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.`;

    // Call Claude API
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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: 'Claude API failed',
        status: response.status,
        details: errorText.substring(0, 200)
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || 'Content generation failed';
    
    // Quality analysis
    const wordCount = content.split(/\s+/).length;
    const hasH1 = content.includes('# ');
    const h2Count = (content.match(/## /g) || []).length;
    const h3Count = (content.match(/### /g) || []).length;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const boldCount = (content.match(/\*\*.*?\*\*/g) || []).length;
    const bulletCount = (content.match(/^- /gm) || []).length;
    const faqCount = content.toLowerCase().includes('frequently asked questions') ? 1 : 0;

    // Calculate quality score
    const qualityScore = Math.min(100, Math.round(
      (wordCount >= selectedModel.targetWords * 0.8 ? 20 : 10) +
      (hasH1 ? 15 : 0) +
      (h2Count >= 8 ? 15 : h2Count * 2) +
      (h3Count >= 10 ? 10 : h3Count) +
      (linkCount >= 5 ? 15 : linkCount * 3) +
      (boldCount >= 15 ? 10 : boldCount * 0.7) +
      (bulletCount >= 20 ? 10 : bulletCount * 0.5) +
      (faqCount ? 5 : 0)
    ));

    return res.status(200).json({
      success: true,
      content,
      qualityScore,
      qualityBreakdown: {
        wordCount,
        targetWords: selectedModel.targetWords,
        hasH1Title: hasH1,
        h2Sections: h2Count,
        h3Sections: h3Count,
        affiliateLinks: linkCount,
        boldPhrases: boldCount,
        bulletPoints: bulletCount,
        hasFAQ: faqCount > 0
      },
      metadata: {
        modelUsed: selectedModel.model,
        modelTier,
        estimatedCost: selectedModel.cost,
        generatedAt: new Date().toISOString(),
        niche,
        product,
        keywords
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Content generation failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
