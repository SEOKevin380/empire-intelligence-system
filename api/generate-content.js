// Ultra Safe Response - /api/generate-content.js
// Includes every possible field/array to prevent undefined errors

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'WORKING',
      message: 'API online'
    });
  }

  if (req.method === 'POST') {
    const { niche, product, keywords, modelTier = 'standard' } = req.body || {};
    
    // Ultra comprehensive response with every possible field as safe defaults
    return res.status(200).json({
      success: true,
      content: `Debug: Niche=${niche||'missing'}, Product=${product||'missing'}, Keywords=${keywords||'missing'}`,
      
      // Quality metrics with safe defaults
      qualityScore: 85,
      qualityBreakdown: {
        wordCount: 50,
        targetWords: 2000,
        hasH1Title: true,
        h1Title: { score: 85, details: 'Debug mode', requirement: 'H1 title' },
        h2Sections: 1,
        h3Sections: 0,
        headingStructure: { score: 70, details: '1 H2, 0 H3', requirement: '8+ H2, 15+ H3' },
        affiliateLinks: 0,
        boldPhrases: 3,
        bulletPoints: 0,
        hasFAQ: false,
        faqQuality: { score: 0, details: 'No FAQ', requirement: 'FAQ section' },
        formatting: { score: 60, details: '3 bold, 0 bullets', requirement: '15+ bold, 20+ bullets' }
      },
      
      // SEO metrics with safe defaults
      seoMetrics: {
        keywordDensity: {
          density: '1.0%',
          occurrences: 1,
          optimal: false
        }
      },
      
      // Metadata with safe defaults
      metadata: {
        modelUsed: 'debug-mode',
        modelTier: modelTier,
        estimatedCost: 0.00,
        generatedAt: new Date().toISOString(),
        niche: niche || 'not-provided',
        product: product || 'not-provided',
        keywords: keywords || 'not-provided',
        wordCount: 50,
        inputData: {
          niche: niche || 'missing',
          product: product || 'missing', 
          keywords: keywords || 'missing'
        }
      },
      
      // Compliance with safe defaults
      complianceStatus: {
        affiliateDisclosure: false,
        healthDisclaimer: false,
        overallCompliance: false
      },
      
      // Arrays with safe defaults (this might be causing the .length error)
      optimizationSuggestions: [
        'Debug mode active',
        ...((!product) ? ['Product field missing'] : []),
        ...((!keywords) ? ['Keywords field missing'] : []),
        ...((!niche) ? ['Niche field missing'] : [])
      ],
      
      // Additional arrays that might be expected
      breakdown: [],
      suggestions: [],
      errors: [],
      warnings: [],
      results: [],
      items: [],
      data: [],
      list: [],
      
      // Additional objects that might be expected
      analysis: {
        status: 'debug',
        results: []
      },
      
      validation: {
        passed: true,
        errors: []
      },
      
      // Status fields
      status: 'success',
      message: 'Debug response generated',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
