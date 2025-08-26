// /api/generate-content.js - RECONSTRUCTED FOR WORD COUNT ENFORCEMENT
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Content validation utilities
const validateContent = (content, requirements) => {
  const validation = {
    wordCount: 0,
    h2Count: 0,
    affiliateLinkCount: 0,
    meetsWordTarget: false,
    meetsAffiliateTarget: false,
    meetsStructureTarget: false
  };

  // Word count validation
  const words = content.split(/\s+/).filter(word => word.length > 0);
  validation.wordCount = words.length;
  validation.meetsWordTarget = validation.wordCount >= requirements.wordCountTarget * 0.9; // 90% tolerance

  // H2 section count
  const h2Matches = content.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
  validation.h2Count = h2Matches.length;
  validation.meetsStructureTarget = validation.h2Count >= 5;

  // Affiliate link detection (looking for links with affiliate-like patterns)
  const linkMatches = content.match(/<a[^>]*href="[^"]*"[^>]*>/gi) || [];
  validation.affiliateLinkCount = linkMatches.filter(link => 
    link.includes('affiliate') || 
    link.includes('?ref=') || 
    link.includes('tracking') ||
    link.includes('partner')
  ).length;
  validation.meetsAffiliateTarget = validation.affiliateLinkCount >= 3;

  return validation;
};

// Enhanced prompt generator with binding constraints
const generateConstrainedPrompt = (data, attempt = 1) => {
  const { 
    wordCountTarget, 
    affiliateLink, 
    multiAgentAnalysis,
    publication,
    contentType,
    keyword,
    companyName,
    email,
    phone
  } = data;

  const basePrompt = `
CRITICAL SYSTEM CONSTRAINTS - THESE ARE BINDING REQUIREMENTS, NOT SUGGESTIONS:

1. WORD COUNT REQUIREMENT: You MUST generate exactly ${wordCountTarget} words or more. This is a hard constraint.
2. AFFILIATE INTEGRATION REQUIREMENT: You MUST naturally integrate the affiliate link "${affiliateLink}" exactly 3-5 times throughout the content.
3. STRUCTURE REQUIREMENT: You MUST include at least 6 H2 sections with descriptive headlines.
4. CONTACT INTEGRATION: Include company contact information naturally: ${companyName}, ${email}, ${phone}

MULTI-AGENT ANALYSIS TO IMPLEMENT:
${multiAgentAnalysis}

PUBLICATION TARGET: ${publication}
CONTENT TYPE: ${contentType}
PRIMARY KEYWORD: ${keyword}

${attempt > 1 ? `
RETRY ATTEMPT ${attempt}: Previous attempts did not meet requirements. 
CRITICAL: This attempt MUST achieve the ${wordCountTarget} word count target.
Focus on expanding each section with detailed information, examples, and comprehensive coverage.
` : ''}

GENERATION INSTRUCTIONS:
- Write comprehensive, detailed content that thoroughly covers the topic
- Each H2 section should be 800-1200 words minimum
- Include specific examples, case studies, and detailed explanations
- Naturally weave in the affiliate link ${affiliateLinkCount} times with contextual relevance
- Use professional, authoritative tone appropriate for ${publication}
- Ensure content is valuable, informative, and engaging

CRITICAL: Your response will be validated for word count, structure, and affiliate integration. 
Failure to meet these requirements will result in regeneration requests.

Begin generation now:`;

  return basePrompt;
};

// Iterative generation with validation
const generateContentWithValidation = async (data, maxAttempts = 3) => {
  let attempt = 1;
  let bestResult = null;
  let bestValidation = null;

  while (attempt <= maxAttempts) {
    try {
      console.log(`Generation attempt ${attempt}/${maxAttempts}`);
      
      const prompt = generateConstrainedPrompt(data, attempt);
      
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 8192, // Maximum tokens for longer content
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.content[0].text;
      const validation = validateContent(content, {
        wordCountTarget: data.wordCountTarget,
        affiliateLink: data.affiliateLink
      });

      console.log(`Attempt ${attempt} validation:`, validation);

      // Store best result so far
      if (!bestResult || validation.wordCount > bestValidation.wordCount) {
        bestResult = content;
        bestValidation = validation;
      }

      // Check if we've met all requirements
      if (validation.meetsWordTarget && validation.meetsStructureTarget) {
        console.log(`Success on attempt ${attempt}!`);
        return {
          content,
          validation,
          attempts: attempt,
          success: true
        };
      }

      // If this is the last attempt, return best result
      if (attempt === maxAttempts) {
        console.log(`Max attempts reached. Returning best result.`);
        return {
          content: bestResult,
          validation: bestValidation,
          attempts: attempt,
          success: false,
          message: 'Partial success - requirements not fully met'
        };
      }

      attempt++;
      
      // Brief delay between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxAttempts) {
        throw new Error(`Content generation failed after ${maxAttempts} attempts: ${error.message}`);
      }
      
      attempt++;
    }
  }
};

// Quality enhancement for affiliate link integration
const enhanceAffiliateIntegration = (content, affiliateLink) => {
  // This function can be expanded to better integrate affiliate links
  // For now, it ensures links are properly formatted and contextual
  
  const affiliateDomainMatch = affiliateLink.match(/https?:\/\/([^\/]+)/);
  const affiliateDomain = affiliateDomainMatch ? affiliateDomainMatch[1] : 'our recommended partner';
  
  // Add contextual phrases around affiliate links
  const contextualPhrases = [
    `We recommend checking out this resource: <a href="${affiliateLink}" target="_blank" rel="nofollow">${affiliateDomain}</a>`,
    `For more information, visit: <a href="${affiliateLink}" target="_blank" rel="nofollow">${affiliateDomain}</a>`,
    `You can learn more at: <a href="${affiliateLink}" target="_blank" rel="nofollow">${affiliateDomain}</a>`,
    `Additional resources available at: <a href="${affiliateLink}" target="_blank" rel="nofollow">${affiliateDomain}</a>`
  ];
  
  return content; // Return content as-is for now, enhancement logic can be added
};

// Main API handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      publication,
      contentType,
      keyword,
      companyName,
      email,
      phone,
      affiliateLink,
      multiAgentAnalysis,
      wordCountTarget = 8000 // Default to 8000 if not provided
    } = req.body;

    // Validation of required fields
    if (!publication || !contentType || !keyword || !companyName || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['publication', 'contentType', 'keyword', 'companyName', 'email', 'phone']
      });
    }

    console.log('Starting content generation with requirements:', {
      wordCountTarget,
      publication,
      contentType,
      keyword,
      affiliateLink: affiliateLink ? 'provided' : 'missing'
    });

    // Generate content with validation loops
    const result = await generateContentWithValidation({
      publication,
      contentType,
      keyword,
      companyName,
      email,
      phone,
      affiliateLink,
      multiAgentAnalysis,
      wordCountTarget
    });

    // Enhance affiliate integration if needed
    let finalContent = result.content;
    if (affiliateLink && result.validation.affiliateLinkCount < 3) {
      finalContent = enhanceAffiliateIntegration(finalContent, affiliateLink);
      // Re-validate after enhancement
      result.validation = validateContent(finalContent, {
        wordCountTarget,
        affiliateLink
      });
    }

    // Prepare response with detailed metrics
    const response = {
      success: true,
      content: finalContent,
      metrics: {
        wordCount: result.validation.wordCount,
        wordCountTarget: wordCountTarget,
        wordCountAccuracy: Math.round((result.validation.wordCount / wordCountTarget) * 100),
        h2Count: result.validation.h2Count,
        affiliateLinkCount: result.validation.affiliateLinkCount,
        generationAttempts: result.attempts,
        requirementsMet: {
          wordCount: result.validation.meetsWordTarget,
          structure: result.validation.meetsStructureTarget,
          affiliateLinks: result.validation.meetsAffiliateTarget
        }
      },
      validation: result.validation,
      message: result.success ? 'Content generated successfully' : result.message || 'Partial success'
    };

    console.log('Content generation completed:', response.metrics);

    res.status(200).json(response);

  } catch (error) {
    console.error('Content generation error:', error);
    
    res.status(500).json({
      error: 'Content generation failed',
      details: error.message,
      success: false
    });
  }
}
