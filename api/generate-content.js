import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and validate request data
    const {
      publication,
      keyword,
      wordCount,
      affiliateLink,
      sourceUrl,
      sourceMaterial,
      company,
      email,
      phone
    } = req.body;

    // Validate mandatory source material (Zero Failure Policy)
    if (!sourceMaterial || sourceMaterial.trim().length === 0) {
      return res.status(400).json({
        error: 'Source material is mandatory for factual accuracy',
        details: 'Zero Failure Policy requires source content',
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // Validate required fields
    if (!keyword || !wordCount || !publication) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Publication, keyword, and word count are required',
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // Multi-generation approach for 8000+ words
    const targetWordCount = parseInt(wordCount) || 8000;
    const affiliateLinks = affiliateLink ? [affiliateLink] : [];
    
    // Calculate generation rounds
    const wordsPerRound = 3500;
    const totalRounds = Math.ceil(targetWordCount / wordsPerRound);
    
    console.log(`Starting multi-generation approach: ${totalRounds} rounds for ${targetWordCount} words`);

    // Initialize content accumulator
    let accumulatedContent = '';
    let currentWordCount = 0;

    // Generation rounds
    for (let round = 1; round <= totalRounds; round++) {
      console.log(`Starting generation round ${round}/${totalRounds}`);
      
      // Calculate words needed for this round
      const remainingWords = targetWordCount - currentWordCount;
      const roundWordTarget = Math.min(wordsPerRound, remainingWords);
      
      // Build round-specific prompt
      const roundPrompt = buildRoundPrompt({
        round,
        totalRounds,
        roundWordTarget,
        keyword,
        publication,
        sourceMaterial,
        sourceUrl,
        affiliateLinks,
        company,
        email,
        phone,
        previousContent: accumulatedContent
      });

      // Generate content for this round
      const roundResult = await generateRoundContent(roundPrompt);
      
      if (!roundResult.success) {
        console.error(`Round ${round} failed:`, roundResult.error);
        return res.status(500).json({
          error: 'Content generation failed',
          details: `Round ${round} generation error: ${roundResult.error}`,
          errorType: 'GenerationError',
          success: false,
          timestamp: new Date().toISOString()
        });
      }

      // Accumulate content
      accumulatedContent += (round === 1 ? '' : '\n\n') + roundResult.content;
      currentWordCount += estimateWordCount(roundResult.content);
      
      console.log(`Round ${round} complete. Current word count: ~${currentWordCount}`);
    }

    // Final content assembly
    const finalArticle = {
      content: accumulatedContent,
      wordCount: currentWordCount,
      publication: publication,
      keyword: keyword,
      affiliateLinks: affiliateLinks,
      metadata: {
        company: company || '',
        email: email || '',
        phone: phone || '',
        sourceUrl: sourceUrl || '',
        generatedAt: new Date().toISOString(),
        rounds: totalRounds,
        targetWords: targetWordCount,
        actualWords: currentWordCount
      }
    };

    console.log(`Content generation complete: ${currentWordCount} words in ${totalRounds} rounds`);

    // Return successful response
    return res.status(200).json({
      success: true,
      article: finalArticle,
      message: `Successfully generated ${currentWordCount} words`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      errorType: error.name || 'UnknownError',
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}

// Build round-specific prompt
function buildRoundPrompt({
  round,
  totalRounds,
  roundWordTarget,
  keyword,
  publication,
  sourceMaterial,
  sourceUrl,
  affiliateLinks,
  company,
  email,
  phone,
  previousContent
}) {
  
  const isFirstRound = round === 1;
  const isLastRound = round === totalRounds;
  const isMiddleRound = !isFirstRound && !isLastRound;

  let prompt = '';

  if (isFirstRound) {
    prompt = `Write the INTRODUCTION and BEGINNING sections of a comprehensive ${roundWordTarget}-word article for ${publication}.

PRIMARY KEYWORD: ${keyword}

MANDATORY SOURCE MATERIAL (ZERO FAILURE POLICY):
${sourceMaterial}

REQUIREMENTS:
- Write EXACTLY ${roundWordTarget} words for this section
- Create compelling introduction with keyword optimization
- Use ONLY information from the provided source material
- Include 1-2 natural affiliate link placements: ${affiliateLinks.join(', ')}
- Professional tone suitable for ${publication}
- Start with engaging headline and introduction
- Create H2 sections for main points

CONTACT INFO TO INCLUDE:
Company: ${company}
Email: ${email}  
Phone: ${phone}

This is PART 1 of ${totalRounds}. Focus on introduction and early content sections.`;

  } else if (isLastRound) {
    prompt = `Write the CONCLUSION and FINAL sections of a comprehensive article, completing the content started below.

PREVIOUS CONTENT:
${previousContent.substring(0, 1000)}...

PRIMARY KEYWORD: ${keyword}

MANDATORY SOURCE MATERIAL (ZERO FAILURE POLICY):
${sourceMaterial}

REQUIREMENTS:
- Write EXACTLY ${roundWordTarget} words for this conclusion section
- Create strong, actionable conclusion
- Include final 1-2 affiliate link placements: ${affiliateLinks.join(', ')}
- Summarize key points from source material
- End with compelling call-to-action
- Maintain consistency with previous content

This is the FINAL PART (${round}/${totalRounds}). Bring the article to a powerful conclusion.`;

  } else {
    prompt = `Continue writing the MIDDLE section of a comprehensive article, building on the content started below.

PREVIOUS CONTENT:
${previousContent.substring(0, 1000)}...

PRIMARY KEYWORD: ${keyword}

MANDATORY SOURCE MATERIAL (ZERO FAILURE POLICY):
${sourceMaterial}

REQUIREMENTS:
- Write EXACTLY ${roundWordTarget} words for this middle section
- Continue seamlessly from previous content
- Develop main points from source material
- Include 1 natural affiliate link placement: ${affiliateLinks.join(', ')}
- Create detailed H2 sections
- Maintain professional flow and consistency

This is PART ${round} of ${totalRounds}. Focus on detailed development of main content.`;
  }

  return prompt;
}

// Generate content for a single round
async function generateRoundContent(prompt) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract content from response
    const generatedContent = response.content[0]?.text;
    
    if (!generatedContent) {
      return {
        success: false,
        error: 'No content generated from Claude API'
      };
    }

    return {
      success: true,
      content: generatedContent
    };

  } catch (apiError) {
    console.error('Claude API Error:', apiError);
    return {
      success: false,
      error: apiError.message || 'Claude API call failed'
    };
  }
}

// Estimate word count
function estimateWordCount(text) {
  return text.trim().split(/\s+/).length;
}
