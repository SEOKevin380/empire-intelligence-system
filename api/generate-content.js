// Complete Response Format - /api/generate-content.js
// Returns ALL expected fields to prevent undefined errors

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'EMPIRE_INTELLIGENCE_ONLINE',
      message: 'SEO content generation API ready',
      version: 'V16.1'
    });
  }

  if (req.method === 'POST') {
    const { niche, product, keywords, modelTier = 'standard', targetUrl } = req.body || {};
    
    // Create debug content that shows what was received
    const debugContent = `# Debug: Form Data Analysis

## Received Data:
- **Niche**: ${niche || 'NOT RECEIVED'}
- **Product**: ${product || 'NOT RECEIVED'} 
- **Keywords**: ${keywords || 'NOT RECEIVED'}
- **Model Tier**: ${modelTier}
- **Target URL**: ${targetUrl || 'Not provided'}

## Field Status:
${niche ? '✅' : '❌'} Niche field
${product ? '✅' : '❌'} Product field  
${keywords ? '✅' : '❌'} Keywords field

## Next Steps:
${!product || !keywords ? 
  'Fix missing fields in your form, then we can enable full content generation!' :
  'All fields received! Ready to enable Claude API content generation.'}

This is a debug response to identify the form data issue.`;

    // Return complete response with ALL expected fields
    return res.status(200).json({
      success: true,
      content: debugContent,
      qualityScore: 75,
      qualityBreakdown: {
        wordCount: debugContent.split(' ').length || 0,
        targetWords: 2000,
        hasH1Title: true,
        h2Sections: 3,
        h3Sections: 0,
        affiliateLinks: 0,
        boldPhrases: 6,
        bulletPoints: 6,
        hasFAQ: false
      },
      seoMetrics: {
        keywordDensity: {
          density: '0.5%',
          occurrences: 2,
          optimal: false
        }
      },
      metadata: {
        modelUsed: 'debug-mode',
        modelTier: modelTier,
        estimatedCost: 0.00,
        generatedAt: new Date().toISOString(),
        niche: niche || 'missing',
        product: product || 'missing', 
        keywords: keywords || 'missing'
      },
      complianceStatus: {
        affiliateDisclosure: true,
        healthDisclaimer: true,
        overallCompliance: true
      },
      optimizationSuggestions: [
        !product ? 'Product field is required' : null,
        !keywords ? 'Keywords field is required' : null,
        'Debug mode active - no content generated'
      ].filter(Boolean)
    });
  }

  return res.status(405).json({ 
    error: 'Method not allowed',
    allowed: ['GET', 'POST', 'OPTIONS']
  });
}
