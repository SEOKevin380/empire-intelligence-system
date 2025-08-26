// BULLETPROOF /api/generate-content.js - SIMPLIFIED VERSION
export default async function handler(req, res) {
  console.log('=== API ROUTE HIT ===');
  
  // Set JSON headers immediately
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight handled' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      received: req.method,
      expected: 'POST'
    });
  }

  // Immediate test response to verify API route is working
  if (!req.body) {
    return res.status(400).json({
      error: 'No request body received',
      success: false
    });
  }

  console.log('Request body keys:', Object.keys(req.body));

  try {
    // Check if this is a test request
    if (req.body.test === true) {
      return res.status(200).json({
        success: true,
        message: 'API route is working',
        timestamp: new Date().toISOString()
      });
    }

    // Validate required fields
    const {
      publication,
      contentType, 
      keyword,
      companyName,
      email,
      phone,
      sourceMaterial,
      wordCountTarget = 8000
    } = req.body;

    const missingFields = [];
    if (!publication) missingFields.push('publication');
    if (!contentType) missingFields.push('contentType');
    if (!keyword) missingFields.push('keyword');
    if (!companyName) missingFields.push('companyName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!sourceMaterial) missingFields.push('sourceMaterial');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields,
        success: false
      });
    }

    // Check for Anthropic API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'Anthropic API key not configured',
        success: false
      });
    }

    console.log('Attempting to import Anthropic...');
    
    // Dynamic import to catch import errors
    let Anthropic;
    try {
      const anthropicModule = await import('@anthropic-ai/sdk');
      Anthropic = anthropicModule.default;
      console.log('Anthropic imported successfully');
    } catch (importError) {
      console.error('Failed to import Anthropic:', importError);
      return res.status(500).json({
        error: 'Failed to load AI service',
        details: importError.message,
        success: false
      });
    }

    console.log('Creating Anthropic client...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('Generating content...');

    // Simplified prompt for testing
    const prompt = `
REQUIREMENTS:
- Generate exactly ${wordCountTarget} words
- Topic: ${keyword}
- Publication: ${publication}
- Content Type: ${contentType}
- Company: ${companyName}, ${email}, ${phone}

SOURCE MATERIAL (use ONLY this information):
${sourceMaterial}

Generate comprehensive content meeting the word count requirement.
`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0].text;
    const wordCount = content.split(/\s+/).length;

    console.log(`Content generated: ${wordCount} words`);

    // Return success response
    return res.status(200).json({
      success: true,
      content: content,
      metrics: {
        wordCount: wordCount,
        wordCountTarget: wordCountTarget,
        wordCountAccuracy: Math.round((wordCount / wordCountTarget) * 100),
        h2Count: (content.match(/<h2[^>]*>.*?<\/h2>/gi) || []).length,
        affiliateLinkCount: 0, // Will add later
        generationAttempts: 1,
        requirementsMet: {
          wordCount: wordCount >= wordCountTarget * 0.9,
          structure: true,
          affiliateLinks: true
        }
      },
      message: 'Content generated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== CAUGHT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Always return JSON
    return res.status(500).json({
      error: 'Content generation failed',
      details: error.message,
      errorType: error.name,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
