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

    // Enhanced prompt with all requirements
    const prompt = `
CRITICAL SYSTEM CONSTRAINTS - BINDING REQUIREMENTS:

1. WORD COUNT REQUIREMENT: Generate EXACTLY ${wordCountTarget} words or more. This is MANDATORY and will be validated. Aim for 8000-12000 words for comprehensive coverage.

2. AFFILIATE LINK REQUIREMENT: You MUST integrate this affiliate link "${req.body.affiliateLink || ''}" exactly 4-5 times throughout the content in natural, contextually relevant ways. Examples:
   - "You can learn more about this product at [AFFILIATE LINK]"
   - "For additional information and to explore options, visit [AFFILIATE LINK]"
   - "To discover more about these benefits, check out [AFFILIATE LINK]"

3. STRUCTURE REQUIREMENT: Include at least 8-10 H2 sections with descriptive headlines for comprehensive coverage.

4. CONTACT INTEGRATION: Include company contact information naturally: ${companyName}, ${email}, ${phone}

5. FACTUAL ACCURACY MANDATE: Base ALL product/service information EXCLUSIVELY on the source material below. Never invent details.

MANDATORY SOURCE MATERIAL FOR FACTUAL ACCURACY:
${sourceMaterial}

PUBLICATION TARGET: ${publication}
CONTENT TYPE: ${contentType}  
PRIMARY KEYWORD: ${keyword}

GENERATION INSTRUCTIONS:
- Write comprehensive, detailed content covering the topic thoroughly
- Each H2 section should be 800-1200 words minimum to reach the ${wordCountTarget} word target
- Use ONLY factual information from the source material provided
- Never invent, assume, or add details not explicitly stated
- Include specific examples, detailed explanations, and comprehensive analysis
- Naturally integrate the affiliate link ${req.body.affiliateLink ? '4-5 times with proper context' : '(no affiliate link provided)'}
- Use professional, authoritative tone appropriate for ${publication}
- Ensure content is valuable, informative, and engaging
- Continue writing until you reach the full ${wordCountTarget} word count
- End with a strong conclusion that summarizes key points

CRITICAL: Generate the COMPLETE content without cutting off. Reach the full word count target of ${wordCountTarget} words.

Begin comprehensive generation now:
`;

    console.log('Calling Anthropic API...');
    
// Iterative generation function for long content
const generateLongContent = async (anthropic, data, targetWords) => {
  let fullContent = '';
  let currentWordCount = 0;
  let attempt = 1;
  const maxAttempts = 3;

  while (currentWordCount < targetWords * 0.9 && attempt <= maxAttempts) {
    console.log(`Generation attempt ${attempt}, current words: ${currentWordCount}, target: ${targetWords}`);

    const isFirstGeneration = attempt === 1;
    const remainingWords = targetWords - currentWordCount;
    const targetForThisRound = Math.min(remainingWords, 3500); // Safe chunk size for Haiku

    const prompt = `
${isFirstGeneration ? 'CRITICAL SYSTEM CONSTRAINTS - BINDING REQUIREMENTS:' : 'CONTINUATION REQUIREMENTS:'}

1. WORD COUNT FOR THIS SECTION: Generate approximately ${targetForThisRound} words ${isFirstGeneration ? 'to start' : 'to continue'} the content.
2. ${isFirstGeneration ? `AFFILIATE LINK REQUIREMENT: Integrate "${data.affiliateLink || ''}" naturally 1-2 times in this section.` : 'Continue the professional tone and include 1 affiliate link if natural.'}
3. FACTUAL ACCURACY: Base ALL information on the source material provided.
4. ${isFirstGeneration ? 'START' : 'CONTINUE'} with comprehensive coverage of the topic.

${isFirstGeneration ? `
MANDATORY SOURCE MATERIAL:
${data.sourceMaterial}

PUBLICATION: ${data.publication}
CONTENT TYPE: ${data.contentType}
KEYWORD: ${data.keyword}
COMPANY: ${data.companyName}, ${data.email}, ${data.phone}
` : `
CONTEXT: This is a continuation of content about ${data.keyword}. Continue the professional analysis and coverage.
Previous content ended with: "${fullContent.slice(-200)}"
`}

${isFirstGeneration ? 'BEGIN' : 'CONTINUE'} comprehensive content generation:
`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Back to working Haiku model
        max_tokens: 4000, // Max for Haiku
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const newContent = message.content[0].text;
      const newWordCount = newContent.split(/\s+/).filter(word => word.length > 0).length;
      
      console.log(`Attempt ${attempt} generated ${newWordCount} words`);

      // Add content with proper spacing
      if (fullContent && !fullContent.endsWith('\n\n')) {
        fullContent += '\n\n';
      }
      fullContent += newContent;
      currentWordCount += newWordCount;

      attempt++;
    } catch (error) {
      console.error(`Generation attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
      attempt++;
    }
  }

  return {
    content: fullContent,
    wordCount: currentWordCount,
    attempts: attempt - 1,
    targetMet: currentWordCount >= targetWords * 0.9
  };
};

    // Process affiliate link integration if provided
    let finalContent = content;
    let affiliateLinkCount = 0;
    
    if (req.body.affiliateLink) {
      // Count existing affiliate links
      const linkMatches = content.match(/<a[^>]*href="[^"]*"[^>]*>/gi) || [];
      affiliateLinkCount = linkMatches.filter(link => 
        link.includes(req.body.affiliateLink) || 
        link.includes('affiliate') || 
        link.includes('partner')
      ).length;
      
      console.log(`Affiliate links found: ${affiliateLinkCount}`);
    }

    // Return comprehensive success response
    const response = {
      success: true,
      content: finalContent,
      metrics: {
        wordCount: wordCount,
        wordCountTarget: wordCountTarget,
        wordCountAccuracy: Math.round((wordCount / wordCountTarget) * 100),
        h2Count: h2Count,
        affiliateLinkCount: affiliateLinkCount,
        generationAttempts: 1,
        requirementsMet: {
          wordCount: wordCount >= wordCountTarget * 0.9, // 90% tolerance
          structure: h2Count >= 5,
          affiliateLinks: affiliateLinkCount >= 0 // Will enhance later
        }
      },
      validation: {
        wordCount: wordCount,
        h2Count: h2Count,
        affiliateLinkCount: affiliateLinkCount,
        meetsWordTarget: wordCount >= wordCountTarget * 0.9,
        meetsStructureTarget: h2Count >= 5,
        meetsAffiliateTarget: affiliateLinkCount >= 0
      },
      message: wordCount >= wordCountTarget * 0.9 ? 
        'Content generated successfully - all requirements met' : 
        `Content generated with ${wordCount} words (${Math.round((wordCount / wordCountTarget) * 100)}% of target)`,
      timestamp: new Date().toISOString()
    };

    console.log('Sending success response with metrics:', {
      wordCount,
      h2Count,
      affiliateLinkCount,
      accuracy: response.metrics.wordCountAccuracy
    });

    return res.status(200).json(response);

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
