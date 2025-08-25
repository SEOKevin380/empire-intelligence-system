// /api/generate-content.js
// Stable Quality Assurance System - Reliable Production Architecture

export default async function handler(req, res) {
  // Set CORS headers
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
    console.log('Starting content generation with quality controls');

    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Missing API key');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    // Extract and validate request data
    const {
      niche,
      contentType,
      platform,
      sourceMaterial,
      targetAudience,
      wordCount,
      additionalRequirements,
      keyword,
      affiliateLink,
      companyName,
      email,
      phone,
      authorCredentials
    } = req.body;

    console.log('Request data:', { niche, contentType, platform, keyword });

    // Input validation
    if (!niche || !contentType || !platform || !keyword || !sourceMaterial) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['niche', 'contentType', 'platform', 'keyword', 'sourceMaterial']
      });
    }

    // Calculate target word count
    const nicheTargets = {
      'health-supplements': 3200,
      'technology': 2800,
      'finance': 3500,
      'ecommerce': 3000
    };
    const targetWords = parseInt(wordCount) || nicheTargets[niche] || 2500;

    console.log(`Target word count: ${targetWords}`);

    // Build enhanced prompt with quality requirements
    const prompt = buildQualityPrompt({
      niche,
      contentType,
      platform,
      sourceMaterial,
      targetAudience: targetAudience || 'General audience',
      targetWords,
      additionalRequirements,
      keyword,
      affiliateLink,
      companyName,
      email,
      phone,
      authorCredentials
    });

    console.log('Making Claude API call...');

    // Single API call with comprehensive prompt
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
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errorText);
      return res.status(claudeResponse.status).json({
        error: 'Content generation failed',
        message: 'API service temporarily unavailable',
        details: errorText
      });
    }

    const data = await claudeResponse.json();
    let generatedContent = data.content[0].text;

    console.log(`Content generated: ${generatedContent.split(' ').length} words`);

    // Post-processing quality enhancements
    generatedContent = enhanceContentQuality(generatedContent, {
      keyword,
      affiliateLink,
      targetWords,
      niche
    });

    // Calculate quality metrics
    const qualityMetrics = calculateQualityMetrics(generatedContent, {
      targetWords,
      affiliateLink,
      keyword
    });

    console.log('Quality metrics:', qualityMetrics);

    // Generate compliance disclaimers
    const disclaimers = generateCompliance(niche, platform);

    // Return enhanced response
    return res.status(200).json({
      success: true,
      content: generatedContent,
      qualityScore: qualityMetrics.overallScore,
      qualityBreakdown: qualityMetrics.breakdown,
      disclaimers,
      metadata: {
        niche,
        contentType,
        platform,
        targetWords,
        actualWords: generatedContent.split(' ').length,
        generatedAt: new Date().toISOString(),
        qualityEnhanced: true
      }
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Content generation failed',
      details: error.message
    });
  }
}

function buildQualityPrompt(specs) {
  return `You are an expert content writer creating a comprehensive ${specs.contentType} article about "${specs.keyword}" for the ${specs.niche} niche.

CRITICAL REQUIREMENTS - MUST BE FOLLOWED EXACTLY:

1. WORD COUNT: Generate exactly ${specs.targetWords} words minimum. This is non-negotiable.

2. FORMATTING STRUCTURE:
   - Use proper markdown headings: ## for main sections, ### for subsections
   - Include 8-12 main sections with detailed content
   - Use **bold text** for important points and keywords
   - Include bullet points and numbered lists throughout
   - Each main section should be 250-400 words

3. CONTENT SECTIONS REQUIRED:
   - Compelling introduction (300+ words)
   - What is ${specs.keyword}? (definition and overview)
   - Key benefits and advantages
   - How it works / methodology
   - Comparison with alternatives
   - Best practices and tips
   - Common questions or concerns
   - Expert recommendations
   - Comprehensive conclusion (300+ words)

4. AFFILIATE LINK INTEGRATION ${specs.affiliateLink ? `(MANDATORY):
   - Integrate this link naturally 4-5 times: ${specs.affiliateLink}
   - Use contextual anchor text like "learn more here", "visit official site", "get started now"
   - Place links in: introduction, 2-3 main sections, conclusion
   - Make integration feel natural and helpful` : '(Not applicable for informational content)'}

5. SOURCE MATERIAL COMPLIANCE:
   Base all factual information on this source material:
   ${specs.sourceMaterial}

6. QUALITY STANDARDS:
   - Expert-level authority and credibility
   - Comprehensive coverage of the topic
   - Actionable insights and practical advice
   - Professional tone throughout
   - SEO-optimized keyword integration
   - Clear, engaging writing style

7. NICHE-SPECIFIC REQUIREMENTS:
   ${getNicheRequirements(specs.niche)}

TARGET AUDIENCE: ${specs.targetAudience}

ADDITIONAL REQUIREMENTS: ${specs.additionalRequirements || 'Follow industry best practices'}

COMPANY INFO:
${specs.companyName ? `Company: ${specs.companyName}` : ''}
${specs.email ? `Contact: ${specs.email}` : ''}
${specs.authorCredentials ? `Author: ${specs.authorCredentials}` : ''}

Generate the complete ${specs.targetWords}+ word article now with all formatting and requirements implemented:`;
}

function getNicheRequirements(niche) {
  const requirements = {
    'health-supplements': `
   - Include safety considerations and side effects
   - Mention consulting healthcare providers
   - Use scientific terminology appropriately
   - Include dosage and usage guidelines
   - Address FDA regulations and disclaimers`,
    
    'technology': `
   - Include technical specifications and features
   - Compare with competing solutions
   - Address implementation considerations
   - Include pricing and ROI information
   - Mention system requirements and compatibility`,
    
    'finance': `
   - Include risk disclosures and warnings
   - Provide market analysis and trends
   - Address regulatory compliance
   - Include cost-benefit analysis
   - Mention professional consultation requirements`,
    
    'ecommerce': `
   - Include product specifications and features
   - Address shipping and return policies
   - Include customer reviews and testimonials
   - Compare pricing across platforms
   - Address quality and warranty information`
  };

  return requirements[niche] || 'Follow standard industry practices for this niche';
}

function enhanceContentQuality(content, specs) {
  let enhanced = content;

  // Ensure minimum word count through expansion
  const currentWords = enhanced.split(' ').length;
  if (currentWords < specs.targetWords * 0.8) {
    console.log(`Expanding content from ${currentWords} to meet target ${specs.targetWords}`);
    enhanced = expandContent(enhanced, specs);
  }

  // Enhance formatting if insufficient
  if (!enhanced.includes('##') || enhanced.split('##').length < 5) {
    console.log('Enhancing content formatting');
    enhanced = improveFormatting(enhanced, specs.keyword);
  }

  // Ensure affiliate link integration
  if (specs.affiliateLink) {
    const linkCount = (enhanced.match(new RegExp(escapeRegex(specs.affiliateLink), 'g')) || []).length;
    if (linkCount < 3) {
      console.log('Adding affiliate link integration');
      enhanced = addAffiliateLinks(enhanced, specs.affiliateLink);
    }
  }

  return enhanced;
}

function expandContent(content, specs) {
  // Add FAQ section if missing
  if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('frequently asked')) {
    content += `\n\n## Frequently Asked Questions About ${specs.keyword}\n\n### What makes ${specs.keyword} effective?\n\nThe effectiveness of ${specs.keyword} comes from its proven methodology and comprehensive approach in the ${specs.niche} space. Research and user feedback consistently demonstrate positive outcomes when proper implementation guidelines are followed.\n\n### How long does it take to see results?\n\nResults can vary based on individual circumstances and implementation approach. Most users report noticeable improvements within 2-4 weeks of consistent application, with optimal results typically achieved after 60-90 days.\n\n### Is ${specs.keyword} suitable for beginners?\n\nAbsolutely. ${specs.keyword} is designed to be accessible for users at all experience levels. The comprehensive guidance and step-by-step approach make it particularly suitable for those new to ${specs.niche}.\n\n### What are the potential risks or side effects?\n\nWhile generally well-tolerated, it's important to understand potential considerations before getting started. Always consult with relevant professionals and follow recommended guidelines for optimal safety and effectiveness.`;
  }

  // Add detailed conclusion if missing or short
  if (!content.toLowerCase().includes('conclusion') || content.split('conclusion')[1]?.length < 200) {
    content += `\n\n## Final Thoughts and Recommendations\n\nAfter comprehensive analysis of ${specs.keyword} in the ${specs.niche} space, the evidence clearly supports its value for those seeking effective solutions. The combination of proven methodology, positive user feedback, and comprehensive support makes it a standout choice.\n\nFor best results, focus on consistent implementation while following recommended guidelines. Remember that individual results may vary, and success often depends on proper application and realistic expectations.\n\nWhether you're just getting started or looking to optimize your current approach, ${specs.keyword} provides the foundation for achieving your goals in ${specs.niche}. Take the first step today and experience the difference that quality solutions can make.`;
  }

  return content;
}

function improveFormatting(content, keyword) {
  // Add basic heading structure
  const paragraphs = content.split('\n\n');
  const enhanced = [];
  
  enhanced.push(`# Complete Guide to ${keyword}: Expert Analysis and Recommendations`);
  
  let sectionCount = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    
    // Convert suitable paragraphs to headings
    if (paragraph.length > 30 && paragraph.length < 80 && sectionCount < 8 && !paragraph.includes('#')) {
      enhanced.push(`## ${paragraph}`);
      sectionCount++;
    } else {
      // Add bold formatting to keyword mentions
      const keywordBold = paragraph.replace(new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi'), `**${keyword}**`);
      enhanced.push(keywordBold);
    }
  }
  
  return enhanced.join('\n\n');
}

function addAffiliateLinks(content, affiliateLink) {
  const sections = content.split('\n\n');
  const enhanced = [];
  let linksAdded = 0;
  
  for (let i = 0; i < sections.length; i++) {
    enhanced.push(sections[i]);
    
    // Add links strategically
    if (i === 2 && linksAdded === 0) {
      enhanced.push(`[Learn more about this solution](${affiliateLink})`);
      linksAdded++;
    } else if (i === Math.floor(sections.length / 2) && linksAdded === 1) {
      enhanced.push(`[Visit the official website for details](${affiliateLink})`);
      linksAdded++;
    } else if (i === sections.length - 3 && linksAdded === 2) {
      enhanced.push(`[Get started today](${affiliateLink})`);
      linksAdded++;
    }
  }
  
  return enhanced.join('\n\n');
}

function calculateQualityMetrics(content, specs) {
  const metrics = {
    wordCount: content.split(' ').length,
    hasHeadings: (content.match(/##/g) || []).length,
    hasBoldText: (content.match(/\*\*/g) || []).length,
    hasLists: (content.match(/^[\s]*[-*]\s/gm) || []).length,
    affiliateLinks: specs.affiliateLink ? (content.match(new RegExp(escapeRegex(specs.affiliateLink), 'g')) || []).length : 0
  };

  const breakdown = {
    wordCount: Math.min((metrics.wordCount / specs.targetWords) * 30, 30),
    formatting: Math.min((metrics.hasHeadings * 3) + (metrics.hasBoldText * 0.5) + (metrics.hasLists * 0.3), 25),
    affiliateLinks: specs.affiliateLink ? Math.min(metrics.affiliateLinks * 5, 20) : 20,
    structure: Math.min(content.split('\n\n').length * 0.8, 15),
    depth: content.includes('FAQ') + content.includes('conclusion') ? 10 : 5
  };

  const overallScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  return {
    breakdown,
    overallScore: Math.round(overallScore),
    metrics
  };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateCompliance(niche, platform) {
  const disclaimers = [];

  if (niche.toLowerCase().includes('health')) {
    disclaimers.push('Medical Disclaimer: This content is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before starting any supplement regimen.');
  }

  if (niche.toLowerCase().includes('finance')) {
    disclaimers.push('Financial Disclaimer: This content is for educational purposes only and does not constitute financial advice. Consult with a qualified financial advisor before making investment decisions.');
  }

  if (platform === 'sponsored-post') {
    disclaimers.push('Sponsored Content Disclosure: This is sponsored content. The publisher may receive compensation for this publication.');
  }

  return disclaimers;
}
