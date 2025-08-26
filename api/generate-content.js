// Field Debugger - /api/generate-content.js
// Shows exactly what field values are being received

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'FIELD_DEBUGGER_ONLINE',
      message: 'Ready to debug field values'
    });
  }

  if (req.method === 'POST') {
    // Extract all possible field variations
    const bodyData = req.body || {};
    const allFields = {
      // Standard field names
      niche: bodyData.niche,
      product: bodyData.product, 
      keywords: bodyData.keywords,
      modelTier: bodyData.modelTier,
      targetUrl: bodyData.targetUrl,
      
      // Possible alternative field names
      productName: bodyData.productName,
      productTitle: bodyData.productTitle,
      keywordList: bodyData.keywordList,
      keywordString: bodyData.keywordString,
      targetKeywords: bodyData.targetKeywords,
      
      // Check all body keys
      allBodyKeys: Object.keys(bodyData),
      bodyLength: Object.keys(bodyData).length
    };

    // Check what's actually present
    const presentFields = {};
    const missingFields = {};
    
    Object.entries(allFields).forEach(([key, value]) => {
      if (key === 'allBodyKeys' || key === 'bodyLength') return;
      
      if (value && value !== '' && value !== null && value !== undefined) {
        presentFields[key] = value;
      } else {
        missingFields[key] = typeof value;
      }
    });

    return res.status(200).json({
      status: 'FIELD_DEBUG_REPORT',
      timestamp: new Date().toISOString(),
      validation: {
        niche: !!bodyData.niche,
        product: !!bodyData.product,
        keywords: !!bodyData.keywords
      },
      fieldAnalysis: {
        presentFields,
        missingFields,
        allBodyKeys: Object.keys(bodyData),
        totalFields: Object.keys(bodyData).length
      },
      rawBody: bodyData,
      recommendation: !bodyData.product ? 'Product field is missing or empty' :
                     !bodyData.keywords ? 'Keywords field is missing or empty' :
                     'All required fields present - should work!'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
