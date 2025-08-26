// Fixed Production Function - /api/generate-content.js
// Empire Intelligence System - Handles actual frontend requests

export default async function handler(req, res) {
  // Enhanced CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'EMPIRE_INTELLIGENCE_ONLINE',
      message: 'Content generation API ready',
      timestamp: new Date().toISOString(),
      version: 'V16.1-Production'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['GET', 'POST', 'OPTIONS']
    });
  }

  try {
    // Enhanced input validation
    console.log('Request received:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    const { niche, product, keywords, modelTier = 'standard', targetUrl } = req.body || {};

    // Detailed validation
    if (!niche || !product || !keywords) {
      console.log('Validation failed:', { niche: !!niche, product: !!product, keywords: !!keywords });
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          niche: !niche ? 'Required field missing' : 'OK',
          product: !product ? 'Required field missing' : 'OK',
          keywords: !keywords ? 'Required field missing' : 'OK'
        },
        received: { niche, product, keywords, modelTier, targetUrl }
      });
    }

    // Model configuration
    const models = {
      efficient: { model: 'claude-3-haiku-20240307', maxTokens: 2500, targetWords: 1200, cost: 0.06 },
      standard: { model: 'claude-3-sonnet-20240229', maxTokens: 3500, targetWords: 2200, cost: 0.15 },
      premium: { model: 'claude-3-5-sonnet-20241022', maxTokens: 4000, targetWords: 3200, cost: 0.40 }
    };

    const selectedModel = models[modelTier] || models.standard;

    // API key check
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('API key missing');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Content generation service unavailable'
      });
    }

    console.log('Generating content with:', { niche, product, keywords, modelTier });

    // Comprehensive content generation prompt
    const contentPrompt = `You are the world's leading SEO content specialist. Create a comprehensive ${selectedModel.targetWords}-word article about "${product}" in the ${niche} niche.

**CRITICAL REQUIREMENTS:**
- Start with H1 title containing "${keywords}"
- Write exactly ${selectedModel.targetWords}+ words
- Include 8+ H2 sections, 15+ H3 subsections
- Add 5+ affiliate links using: ${targetUrl || 'https://example.com/product'}
- Use 15+ bold phrases (**text**)
- Include 20+ bullet points (-)
- Add FAQ section with 8+ product-specific questions
- Include FTC disclosure and health disclaimers

**ARTICLE STRUCTURE:**

# ${keywords} - Complete Guide to ${product}

**${product}** represents a breakthrough in ${niche}, offering proven benefits backed by scientific research. This comprehensive guide covers everything you need to know about **${product}**, including benefits, usage, reviews, and where to find authentic products.

## What is ${product}?

**${product}** is a premium solution specifically designed for ${niche} applications. Key characteristics include:

- Advanced formulation with clinically-proven ingredients
- Superior quality standards and third-party testing
- Extensive research backing and safety profile
- Trusted by thousands of satisfied customers worldwide

### Understanding ${product} Benefits

The primary advantages of **${product}** include:
- Enhanced performance in targeted areas
- Fast-acting results with consistent use
- Long-term safety with minimal side effects
- Excellent value compared to alternatives

### Key Active Ingredients

**${product}** contains carefully selected components:
- Primary active compounds for maximum effectiveness
- Supporting ingredients for enhanced absorption
- Natural elements for safety and tolerability
- Quality-tested materials from verified suppliers

## Top Benefits of ${product}

**${product}** delivers multiple advantages:

### Primary Health Benefits
- **Enhanced Function**: Significant improvement in target areas
- **Rapid Results**: Noticeable effects within recommended timeframe
- **Long-term Value**: Sustained benefits with regular use
- **Safety Assurance**: Minimal side effects when used properly
- **Quality Guarantee**: Third-party tested for purity and potency

### Additional Advantages
- Easy integration into daily routine
- Flexible dosing options for individual needs
- Comprehensive customer support
- Satisfaction guarantee with purchase

For authentic products, [check current prices and availability](${targetUrl || 'https://example.com/product'}).

## How ${product} Works

**${product}** operates through multiple mechanisms to deliver comprehensive benefits. The active ingredients target specific biological pathways to optimize function and performance.

### Mechanism of Action
The science behind **${product}** involves:
- Targeted receptor activation
- Enhanced cellular function
- Improved metabolic processes
- Optimized nutrient utilization

### Absorption and Effectiveness
**${product}** features advanced delivery for:
- Rapid uptake and bioavailability
- Consistent blood levels
- Maximum therapeutic benefit
- Minimal waste or degradation

## Clinical Research and Evidence

### Published Studies
Multiple peer-reviewed studies support **${product}**:
- Clinical trials showing significant improvements
- Comparative research demonstrating superiority
- Long-term safety data from extended use
- Mechanism studies validating the approach

### Expert Recommendations
Healthcare professionals recommend **${product}** for:
- Individuals seeking evidence-based solutions
- Those requiring proven effectiveness
- People prioritizing safety and quality
- Users wanting reliable results

## Real User Reviews and Results

### Customer Satisfaction Data
**${product}** maintains excellent user ratings:
- **95% satisfaction rate** in surveys
- **4.8/5 star average** across platforms
- **90% would recommend** to others
- **85% saw results** within 30 days

### Success Stories
Users consistently report:
- Significant improvements in target areas
- Enhanced quality of life
- Successful long-term maintenance
- Positive overall experience

[See verified customer reviews](${targetUrl || 'https://example.com/product'}) from real users.

## Dosage and Usage Guidelines

### Recommended Protocol
**${product}** should be used as follows:
1. **Starting dose**: Follow manufacturer guidelines
2. **Timing**: Take as directed with/without food
3. **Frequency**: Maintain consistent daily schedule
4. **Duration**: Allow 30-60 days for full benefits
5. **Adjustments**: Modify only under professional guidance

### Best Practices
- Maintain consistent daily usage
- Store in cool, dry conditions
- Avoid contraindicated substances
- Monitor progress regularly
- Consult healthcare provider as needed

## Safety Profile and Precautions

### Common Effects
**${product}** is generally well-tolerated:
- Minor digestive adjustment initially
- Temporary sleep pattern changes
- Slight energy fluctuations during adaptation
- Rare mild headaches in sensitive individuals

### Important Warnings
**${product}** may not be suitable for:
- Pregnant or nursing women
- Individuals under 18 years
- People with specific medical conditions
- Those taking certain medications

### Safety Guidelines
- Consult healthcare provider before use
- Start with recommended dose
- Monitor for adverse reactions
- Discontinue if severe effects occur
- Keep away from children

## ${product} vs Competitors

### Value Comparison
**${product}** offers superior value through:
- Higher potency active ingredients
- Better absorption and bioavailability
- More comprehensive research support
- Superior customer satisfaction ratings
- Stronger quality assurance standards

### Cost Analysis
When comparing options, consider:
- **Cost per serving**: Competitive with premium alternatives
- **Results per dollar**: Superior effectiveness justifies price
- **Long-term value**: Better outcomes reduce overall costs
- **Satisfaction guarantee**: Risk-free trial available

[Compare pricing options](${targetUrl || 'https://example.com/product'}) for best deals.

## Where to Buy ${product}

### Authorized Sources
Purchase authentic **${product}** from:
- Official manufacturer website
- Verified retail partners
- Licensed healthcare providers
- Authorized online marketplaces

### Current Offers
**${product}** purchasing options:
- **Single bottle**: Perfect for first-time users
- **3-bottle pack**: Most popular with savings
- **6-bottle bundle**: Maximum value for regular users
- **Subscription service**: Convenient auto-delivery

[Get exclusive discounts here](${targetUrl || 'https://example.com/product'}) - limited time!

### Shipping and Guarantees
- Fast 2-3 day shipping available
- Free shipping on qualifying orders
- 60-90 day money-back guarantee
- Easy return process

## Frequently Asked Questions

### What makes ${product} different from alternatives?
**${product}** stands out through its unique formulation, extensive research backing, and superior quality standards. The combination of potent ingredients and advanced delivery provides better results than generic options.

### How quickly can I expect results with ${product}?
Most users notice initial improvements within 7-14 days, with significant benefits apparent after 30-60 days of consistent use. Individual results vary based on personal factors and adherence to usage guidelines.

### Can ${product} be used with other supplements?
**${product}** can generally be combined with other supplements, but consult your healthcare provider to ensure no potential interactions with your specific regimen.

### Is ${product} safe for long-term use?
Clinical studies and user data support the long-term safety of **${product}** when used as directed. The natural ingredient profile and extensive testing demonstrate its safety for extended use.

### What if ${product} doesn't work for me?
**${product}** includes a satisfaction guarantee. If you don't experience expected benefits within the specified timeframe, you can return it for a full refund according to the return policy.

### How should I store ${product}?
Store **${product}** in a cool, dry place away from direct sunlight and heat. Keep the container sealed tightly and out of reach of children for maximum potency and safety.

### Are there dietary restrictions with ${product}?
**${product}** accommodates most dietary preferences, but individuals with specific allergies should review the ingredient list and consult healthcare providers if needed.

### What's the optimal time to take ${product}?
The best timing depends on individual preferences and lifestyle. Many users prefer morning use for all-day benefits, while others find evening more convenient. Consistency matters more than specific timing.

## Conclusion

**${product}** represents an excellent choice in the ${niche} market, combining scientific innovation with practical effectiveness. The comprehensive research, positive user experiences, and quality standards make it ideal for achieving your goals.

Key advantages include:
- **Proven effectiveness** with clinical backing
- **Premium quality** ingredients and manufacturing
- **Excellent satisfaction** ratings from users
- **Comprehensive support** with guarantees
- **Competitive pricing** with bulk options

For serious results in ${niche}, **${product}** offers the research, quality, and track record needed for success.

[Secure your supply today](${targetUrl || 'https://example.com/product'}) and experience the difference.

---

**Disclaimer**: This article contains affiliate links. We may earn a commission from purchases at no extra cost to you. This product has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.`;

    // Call Claude API
    console.log('Calling Claude API...');
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
        messages: [{ role: 'user', content: contentPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Claude API error:', response.status, errorText);
      return res.status(500).json({
        error: 'Content generation failed',
        status: response.status,
        details: 'AI service temporarily unavailable'
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || 'Content generation failed';
    
    console.log('Content generated successfully, length:', content.length);

    // Quality analysis
    const wordCount = content.split(/\s+/).length;
    const hasH1 = content.includes('# ');
    const h2Count = (content.match(/## /g) || []).length;
    const h3Count = (content.match(/### /g) || []).length;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const boldCount = (content.match(/\*\*.*?\*\*/g) || []).length;
    const bulletCount = (content.match(/^- /gm) || []).length;
    const hasFAQ = content.toLowerCase().includes('frequently asked questions');

    const qualityScore = Math.min(100, Math.round(
      (wordCount >= selectedModel.targetWords * 0.8 ? 20 : 10) +
      (hasH1 ? 15 : 0) +
      (h2Count >= 8 ? 15 : Math.max(0, h2Count * 2)) +
      (h3Count >= 10 ? 10 : Math.max(0, h3Count)) +
      (linkCount >= 5 ? 15 : Math.max(0, linkCount * 3)) +
      (boldCount >= 15 ? 10 : Math.max(0, boldCount * 0.7)) +
      (bulletCount >= 20 ? 10 : Math.max(0, bulletCount * 0.5)) +
      (hasFAQ ? 5 : 0)
    ));

    console.log('Quality analysis complete:', { wordCount, qualityScore });

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
        hasFAQ
      },
      metadata: {
        modelUsed: selectedModel.model,
        modelTier,
        estimatedCost: selectedModel.cost,
        generatedAt: new Date().toISOString(),
        inputData: { niche, product, keywords }
      }
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Content generation failed',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
