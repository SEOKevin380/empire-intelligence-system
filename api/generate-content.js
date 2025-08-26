// Frontend Compatible Debugger - /api/generate-content.js
// Returns the exact format your frontend expects

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'DEBUGGER_ONLINE',
      message: 'Ready to debug your form submission'
    });
  }

  if (req.method === 'POST') {
    // Return the exact response format your frontend expects for successful content generation
    const bodyData = req.body || {};
    
    // Extract fields exactly as your frontend sends them
    const { niche, product, keywords, modelTier, targetUrl } = bodyData;
    
    return res.status(200).json({
      success: true,
      content: `# DEBUG REPORT - Form Data Analysis

## Field Status Check
- **Niche**: ${niche ? `✅ "${niche}"` : '❌ Missing'}
- **Product**: ${product ? `✅ "${product}"` : '❌ Missing'}  
- **Keywords**: ${keywords ? `✅ "${keywords}"` : '❌ Missing'}
- **Model Tier**: ${modelTier || 'standard'}
- **Target URL**: ${targetUrl || 'Not provided'}

## Raw Request Data
\`\`\`json
${JSON.stringify(bodyData, null, 2)}
\`\`\`

## All Field Keys Received
${Object.keys(bodyData).map(key => `- ${key}: ${typeof bodyData[key]} = "${bodyData[key]}"`).join('\n')}

## Diagnosis
${!product && !keywords ? 'ISSUE: Both product and keywords are missing!' :
  !product ? 'ISSUE: Product field is missing or empty!' :
  !keywords ? 'ISSUE: Keywords field is missing or empty!' :
  'SUCCESS: All required fields are present!'}

This debug report shows exactly what your form is sending to the API.`,
      
      qualityScore: 100,
      qualityBreakdown: {
        wordCount: 150,
        targetWords: 2000,
        hasH1Title: true,
        h2Sections: 3,
        h3Sections: 0,
        affiliateLinks: 0,
        boldPhrases: 5,
        bulletPoints: 8,
        hasFAQ: false
      },
      metadata: {
        modelUsed: 'debug-mode',
        modelTier: modelTier || 'standard',
        estimatedCost: 0,
        generatedAt: new Date().toISOString(),
        inputData: { niche, product, keywords }
      }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
