// /api/generate-content.js
// Zero-Failure Precision Quality Assurance System
// Multi-stage validation with targeted correction protocols

export default async function handler(req, res) {
  // Set CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    const requestData = req.body;
    
    // STAGE 1: Pre-Generation Validation
    const preValidation = validateInputRequirements(requestData);
    if (!preValidation.isValid) {
      return res.status(400).json({
        error: 'Input validation failed',
        failures: preValidation.failures,
        requirements: preValidation.requirements
      });
    }

    const specifications = buildPrecisionSpecifications(requestData);
    
    // STAGE 2: Content Generation with Precision Prompting
    let generationAttempt = 1;
    let generatedContent = null;
    let generationQuality = null;
    const maxGenerationAttempts = 3;

    while (generationAttempt <= maxGenerationAttempts) {
      console.log(`Generation attempt ${generationAttempt}/${maxGenerationAttempts}`);
      
      const prompt = buildPrecisionPrompt(specifications, generationAttempt);
      
      try {
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });

        if (!claudeResponse.ok) {
          throw new Error(`Claude API error: ${claudeResponse.status}`);
        }

        const data = await claudeResponse.json();
        generatedContent = data.content[0].text;

        // STAGE 3: Multi-Dimensional Quality Analysis
        generationQuality = performComprehensiveQualityAnalysis(
          generatedContent, 
          specifications
        );

        console.log(`Attempt ${generationAttempt} quality score: ${generationQuality.overallScore}`);
        console.log('Quality breakdown:', generationQuality.breakdown);

        // STAGE 4: Quality Gate Decision
        if (generationQuality.overallScore >= specifications.qualityThreshold) {
          console.log('Quality threshold met - proceeding to final validation');
          break;
        } else if (generationAttempt === maxGenerationAttempts) {
          console.log('Max attempts reached - applying corrective measures');
          generatedContent = applyCorrectiveMeasures(generatedContent, generationQuality, specifications);
          break;
        } else {
          console.log(`Quality insufficient (${generationQuality.overallScore}/${specifications.qualityThreshold}) - regenerating with enhanced prompt`);
          generationAttempt++;
        }

      } catch (apiError) {
        console.error(`Generation attempt ${generationAttempt} failed:`, apiError.message);
        if (generationAttempt === maxGenerationAttempts) {
          return res.status(500).json({
            error: 'Content generation failed',
            message: 'All generation attempts failed',
            details: apiError.message
          });
        }
        generationAttempt++;
      }
    }

    // STAGE 5: Final Content Validation and Enhancement
    const finalValidation = performFinalValidation(generatedContent, specifications);
    
    if (!finalValidation.isValid) {
      // Apply emergency corrections
      generatedContent = applyEmergencyCorrections(generatedContent, finalValidation, specifications);
    }

    // STAGE 6: Final Quality Recalculation
    const finalQuality = performComprehensiveQualityAnalysis(generatedContent, specifications);
    
    // STAGE 7: Compliance and Disclaimer Generation
    const disclaimers = generatePrecisionCompliance(specifications.niche, specifications.platform);

    // STAGE 8: Response Assembly with Quality Metrics
    return res.status(200).json({
      success: true,
      content: generatedContent,
      qualityScore: finalQuality.overallScore,
      qualityBreakdown: finalQuality.breakdown,
      disclaimers,
      validationPassed: finalValidation.isValid,
      generationAttempts: generationAttempt,
      metadata: {
        niche: specifications.niche,
        contentType: specifications.contentType,
        platform: specifications.platform,
        targetWords: specifications.targetWords,
        actualWords: generatedContent.split(' ').length,
        qualityThreshold: specifications.qualityThreshold,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('System error:', error);
    return res.status(500).json({
      error: 'System failure',
      message: 'Critical error in quality assurance pipeline',
      details: error.message
    });
  }
}

// PRECISION VALIDATION FUNCTIONS

function validateInputRequirements(data) {
  const failures = [];
  const requirements = [];

  // Critical field validation
  if (!data.niche) {
    failures.push('Missing niche specification');
    requirements.push('Niche selection is mandatory');
  }
  
  if (!data.contentType) {
    failures.push('Missing content type');
    requirements.push('Content type selection is mandatory');
  }
  
  if (!data.platform) {
    failures.push('Missing platform specification');
    requirements.push('Platform selection is mandatory');
  }

  if (!data.keyword || data.keyword.trim().length === 0) {
    failures.push('Missing or empty keyword');
    requirements.push('Target keyword is mandatory and must not be empty');
  }

  if (!data.sourceMaterial || data.sourceMaterial.trim().length < 50) {
    failures.push('Insufficient source material');
    requirements.push('Source material must be at least 50 characters');
  }

  if (data.contentType === 'affiliate' && (!data.affiliateLink || !data.affiliateLink.startsWith('http'))) {
    failures.push('Invalid or missing affiliate link');
    requirements.push('Valid affiliate link required for affiliate content');
  }

  return {
    isValid: failures.length === 0,
    failures,
    requirements
  };
}

function buildPrecisionSpecifications(data) {
  const nicheTargets = {
    'health-supplements': { words: 3200, threshold: 85 },
    'technology': { words: 2800, threshold: 80 },
    'finance': { words: 3500, threshold: 90 },
    'ecommerce': { words: 3000, threshold: 82 }
  };

  const nicheConfig = nicheTargets[data.niche] || { words: 2500, threshold: 80 };

  return {
    niche: data.niche,
    contentType: data.contentType,
    platform: data.platform,
    keyword: data.keyword.trim(),
    sourceMaterial: data.sourceMaterial.trim(),
    affiliateLink: data.affiliateLink,
    targetWords: parseInt(data.wordCount) || nicheConfig.words,
    qualityThreshold: nicheConfig.threshold,
    targetAudience: data.targetAudience || 'General audience',
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    authorCredentials: data.authorCredentials
  };
}

function buildPrecisionPrompt(specs, attemptNumber) {
  const attemptModifications = {
    1: '',
    2: `
IMPORTANT - FIRST ATTEMPT FAILED QUALITY STANDARDS:
- Ensure MINIMUM ${specs.targetWords} words (previous attempt was too short)
- Use comprehensive formatting with multiple H2 and H3 headings
- Include extensive bullet points and numbered lists
- Provide deeper, more detailed coverage of each topic`,
    3: `
CRITICAL - FINAL ATTEMPT - MAXIMUM QUALITY REQUIRED:
- This is the final generation attempt - it MUST meet all requirements
- Target word count: ${specs.targetWords} words MINIMUM (no exceptions)
- Use extensive formatting, multiple sections, comprehensive coverage
- If affiliate content, integrate link ${specs.affiliateLink} at least 4 times naturally`
  };

  return `You are an expert content writer creating a comprehensive ${specs.contentType} article about "${specs.keyword}" for the ${specs.niche} niche.

${attemptModifications[attemptNumber]}

MANDATORY SPECIFICATIONS (ZERO TOLERANCE FOR DEVIATION):
- Minimum word count: ${specs.targetWords} words (articles under this count are UNACCEPTABLE)
- Target audience: ${specs.targetAudience}
- Content focus: ${specs.keyword}
- Niche expertise level: Expert/Professional

MANDATORY FORMATTING REQUIREMENTS:
1. Title: Compelling H1 with primary keyword
2. Section structure:
   - 8-12 main sections with H2 headings (##)
   - 2-4 subsections per main section with H3 headings (###)
   - Each main section: 250-400 words minimum
   - Introduction: 300+ words
   - Conclusion: 300+ words

3. Content elements (ALL REQUIRED):
   - **Bold text** for key points and keywords
   - Bullet points for benefits, features, comparisons
   - Numbered lists for steps, processes, rankings
   - Clear topic sentences and transitions
   - Professional paragraph structure

AFFILIATE LINK INTEGRATION ${specs.affiliateLink ? `(MANDATORY):
Primary affiliate link: ${specs.affiliateLink}
REQUIREMENTS:
- Integrate this exact link 4-5 times throughout the article
- Use natural anchor text: "visit the official website", "get [product] here", "try [product] now"
- Placement: Introduction (1x), Main body (2-3x), Conclusion (1x)
- Context must feel natural and helpful, not forced` : '(Not applicable - informational content)'}

SOURCE MATERIAL REQUIREMENTS:
Base ALL factual claims on this source material:
${specs.sourceMaterial}

CONTENT DEPTH REQUIREMENTS:
- Comprehensive topic coverage with expert-level detail
- Include background, context, and supporting information
- Address common questions and concerns
- Provide actionable insights and practical advice
- Use authoritative, professional tone throughout
- Include relevant statistics, facts, and examples

CRITICAL SUCCESS FACTORS:
- Word count MUST exceed ${specs.targetWords} words
- All formatting requirements MUST be implemented
- Content MUST demonstrate expertise and authority
- Information MUST be valuable and actionable
${specs.affiliateLink ? `- Affiliate link MUST be integrated naturally 4-5 times` : ''}

Generate the complete article now:`;
}

function performComprehensiveQualityAnalysis(content, specs) {
  const analysis = {
    wordCount: 0,
    formattingScore: 0,
    affiliateLinkScore: 0,
    structureScore: 0,
    contentDepthScore: 0,
    overallScore: 0,
    breakdown: {}
  };

  const words = content.split(' ');
  analysis.wordCount = words.length;

  // Word Count Analysis (30 points)
  const wordRatio = analysis.wordCount / specs.targetWords;
  if (wordRatio >= 1.0) {
    analysis.breakdown.wordCount = 30;
  } else if (wordRatio >= 0.9) {
    analysis.breakdown.wordCount = 25;
  } else if (wordRatio >= 0.8) {
    analysis.breakdown.wordCount = 15;
  } else if (wordRatio >= 0.7) {
    analysis.breakdown.wordCount = 5;
  } else {
    analysis.breakdown.wordCount = 0;
  }

  // Formatting Analysis (25 points)
  let formattingPoints = 0;
  const h2Count = (content.match(/##\s/g) || []).length;
  const h3Count = (content.match(/###\s/g) || []).length;
  const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
  const bulletCount = (content.match(/^\s*[-*]\s/gm) || []).length;
  const numberCount = (content.match(/^\s*\d+\.\s/gm) || []).length;

  if (h2Count >= 8) formattingPoints += 8;
  else if (h2Count >= 5) formattingPoints += 5;
  else if (h2Count >= 3) formattingPoints += 3;

  if (h3Count >= 10) formattingPoints += 7;
  else if (h3Count >= 5) formattingPoints += 4;
  else if (h3Count >= 2) formattingPoints += 2;

  if (boldCount >= 20) formattingPoints += 5;
  else if (boldCount >= 10) formattingPoints += 3;
  else if (boldCount >= 5) formattingPoints += 1;

  if (bulletCount >= 30) formattingPoints += 3;
  else if (bulletCount >= 15) formattingPoints += 2;
  else if (bulletCount >= 5) formattingPoints += 1;

  if (numberCount >= 10) formattingPoints += 2;
  else if (numberCount >= 5) formattingPoints += 1;

  analysis.breakdown.formatting = Math.min(formattingPoints, 25);

  // Affiliate Link Analysis (20 points)
  if (specs.affiliateLink) {
    const linkCount = (content.match(new RegExp(escapeRegex(specs.affiliateLink), 'g')) || []).length;
    if (linkCount >= 4) {
      analysis.breakdown.affiliateLinks = 20;
    } else if (linkCount >= 3) {
      analysis.breakdown.affiliateLinks = 15;
    } else if (linkCount >= 2) {
      analysis.breakdown.affiliateLinks = 10;
    } else if (linkCount >= 1) {
      analysis.breakdown.affiliateLinks = 5;
    } else {
      analysis.breakdown.affiliateLinks = 0;
    }
  } else {
    analysis.breakdown.affiliateLinks = 20; // N/A bonus for non-affiliate
  }

  // Content Structure Analysis (15 points)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0).length;
  if (paragraphs >= 15) {
    analysis.breakdown.structure = 15;
  } else if (paragraphs >= 10) {
    analysis.breakdown.structure = 12;
  } else if (paragraphs >= 7) {
    analysis.breakdown.structure = 8;
  } else {
    analysis.breakdown.structure = 3;
  }

  // Content Depth Analysis (10 points)
  let depthPoints = 0;
  const keywordCount = countKeywordDensity(content, specs.keyword);
  const professionalTerms = ['benefits', 'research', 'studies', 'analysis', 'comparison', 'expert', 'professional'];
  const professionalCount = professionalTerms.reduce((count, term) => 
    count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length, 0);

  if (keywordCount >= 10 && keywordCount <= 30) depthPoints += 4;
  else if (keywordCount >= 5) depthPoints += 2;

  if (professionalCount >= 15) depthPoints += 4;
  else if (professionalCount >= 10) depthPoints += 3;
  else if (professionalCount >= 5) depthPoints += 2;

  if (content.includes('FAQ') || content.includes('conclusion')) depthPoints += 2;

  analysis.breakdown.contentDepth = Math.min(depthPoints, 10);

  // Calculate Overall Score
  analysis.overallScore = Object.values(analysis.breakdown).reduce((sum, score) => sum + score, 0);

  return analysis;
}

function applyCorrectiveMeasures(content, quality, specs) {
  console.log('Applying corrective measures to content');
  
  let correctedContent = content;

  // Word count correction
  if (quality.breakdown.wordCount < 15) {
    console.log('Applying word count expansion');
    correctedContent = expandContentLength(correctedContent, specs);
  }

  // Formatting correction
  if (quality.breakdown.formatting < 15) {
    console.log('Applying formatting corrections');
    correctedContent = enhanceFormatting(correctedContent);
  }

  // Affiliate link correction
  if (specs.affiliateLink && quality.breakdown.affiliateLinks < 10) {
    console.log('Applying affiliate link integration');
    correctedContent = integrateAffiliateLinks(correctedContent, specs.affiliateLink);
  }

  return correctedContent;
}

function performFinalValidation(content, specs) {
  const wordCount = content.split(' ').length;
  const hasHeadings = content.includes('##');
  const hasBoldText = content.includes('**');
  const hasAffiliateLinkIfRequired = !specs.affiliateLink || content.includes(specs.affiliateLink);

  const failures = [];

  if (wordCount < specs.targetWords * 0.7) {
    failures.push(`Word count too low: ${wordCount}/${specs.targetWords}`);
  }

  if (!hasHeadings) {
    failures.push('Missing required heading structure');
  }

  if (!hasBoldText) {
    failures.push('Missing bold text formatting');
  }

  if (!hasAffiliateLinkIfRequired) {
    failures.push('Missing required affiliate link integration');
  }

  return {
    isValid: failures.length === 0,
    failures,
    metrics: {
      wordCount,
      hasHeadings,
      hasBoldText,
      hasAffiliateLinkIfRequired
    }
  };
}

function applyEmergencyCorrections(content, validation, specs) {
  console.log('Applying emergency corrections');
  
  let corrected = content;

  // Emergency formatting fixes
  if (!validation.metrics.hasHeadings) {
    corrected = addBasicHeadings(corrected, specs);
  }

  if (!validation.metrics.hasBoldText) {
    corrected = addBoldFormatting(corrected, specs.keyword);
  }

  if (!validation.metrics.hasAffiliateLinkIfRequired && specs.affiliateLink) {
    corrected = addEmergencyAffiliateLinks(corrected, specs.affiliateLink);
  }

  return corrected;
}

// UTILITY FUNCTIONS

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countKeywordDensity(content, keyword) {
  const regex = new RegExp(keyword.toLowerCase(), 'gi');
  return (content.toLowerCase().match(regex) || []).length;
}

function expandContentLength(content, specs) {
  // Add conclusion if missing
  if (!content.toLowerCase().includes('conclusion')) {
    content += `\n\n## Conclusion\n\nIn summary, ${specs.keyword} represents a significant opportunity for those interested in ${specs.niche}. The comprehensive analysis presented in this article demonstrates the importance of understanding all aspects of this topic. Whether you're a beginner or an expert, the insights shared here provide valuable guidance for making informed decisions about ${specs.keyword}.`;
  }

  // Add FAQ section if missing
  if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('frequently asked questions')) {
    content += `\n\n## Frequently Asked Questions About ${specs.keyword}\n\n### What makes ${specs.keyword} effective?\n\nThe effectiveness of ${specs.keyword} stems from its comprehensive approach and proven methodology in the ${specs.niche} space.\n\n### How long does it take to see results?\n\nResults can vary depending on individual circumstances, but most users report noticeable improvements within the first few weeks of consistent use.\n\n### Is ${specs.keyword} suitable for beginners?\n\nYes, ${specs.keyword} is designed to be accessible for users at all experience levels, from beginners to advanced practitioners.`;
  }

  return content;
}

function enhanceFormatting(content) {
  // Add basic heading structure if missing
  if (!content.includes('##')) {
    const lines = content.split('\n');
    const enhanced = [];
    let sectionCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Convert long sentences at start of paragraphs to headings
      if (line.length > 50 && line.length < 100 && !line.includes('##') && sectionCount < 8) {
        enhanced.push(`## ${line}`);
        sectionCount++;
      } else {
        enhanced.push(line);
      }
    }
    
    content = enhanced.join('\n');
  }

  // Add bold formatting to keyword mentions
  const keywordRegex = new RegExp(`\\b${escapeRegex(specs.keyword)}\\b`, 'gi');
  content = content.replace(keywordRegex, `**${specs.keyword}**`);

  return content;
}

function addBasicHeadings(content, specs) {
  const sections = content.split('\n\n');
  const enhanced = [];
  
  enhanced.push(`# ${specs.keyword}: Complete Guide for ${specs.niche}`);
  
  for (let i = 0; i < sections.length; i++) {
    if (i === 0) {
      enhanced.push(`## Introduction to ${specs.keyword}`);
    } else if (i === Math.floor(sections.length / 2)) {
      enhanced.push(`## Key Benefits of ${specs.keyword}`);
    } else if (i === sections.length - 1) {
      enhanced.push(`## Conclusion`);
    }
    
    enhanced.push(sections[i]);
  }

  return enhanced.join('\n\n');
}

function addBoldFormatting(content, keyword) {
  const keywordRegex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi');
  return content.replace(keywordRegex, `**${keyword}**`);
}

function integrateAffiliateLinks(content, affiliateLink) {
  const sections = content.split('\n\n');
  const enhanced = [];
  let linksAdded = 0;
  const targetLinks = 3;

  for (let i = 0; i < sections.length && linksAdded < targetLinks; i++) {
    enhanced.push(sections[i]);
    
    if (i === 1 && linksAdded === 0) {
      enhanced.push(`[Learn more about this solution here](${affiliateLink})`);
      linksAdded++;
    } else if (i === Math.floor(sections.length / 2) && linksAdded === 1) {
      enhanced.push(`[Visit the official website](${affiliateLink})`);
      linksAdded++;
    } else if (i === sections.length - 2 && linksAdded === 2) {
      enhanced.push(`[Get started today](${affiliateLink})`);
      linksAdded++;
    }
  }

  return enhanced.join('\n\n');
}

function addEmergencyAffiliateLinks(content, affiliateLink) {
  return content + `\n\n[Learn more here](${affiliateLink})`;
}

function generatePrecisionCompliance(niche, platform) {
  const disclaimers = [];

  const ymylNiches = ['health', 'finance', 'legal', 'safety'];
  if (ymylNiches.some(ymyl => niche.toLowerCase().includes(ymyl))) {
    if (niche.toLowerCase().includes('health')) {
      disclaimers.push('Medical Disclaimer: This content is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any supplement regimen or making health decisions.');
    }
    if (niche.toLowerCase().includes('finance')) {
      disclaimers.push('Financial Disclaimer: This content is for educational purposes only and does not constitute financial advice. Consult with a qualified financial advisor before making investment decisions.');
    }
  }

  if (platform === 'sponsored-post') {
    disclaimers.push('Sponsored Content Disclosure: This is sponsored content. The publisher may receive compensation for this publication.');
  }

  if (platform === 'globe-newswire' || platform === 'newswire') {
    disclaimers.push('Press Release Notice: This content is provided for informational purposes. Readers should verify all claims independently before taking action.');
  }

  return disclaimers;
}
