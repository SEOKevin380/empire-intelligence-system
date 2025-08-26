import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Enhanced affiliate link masking and CTA system
function createMaskedAffiliateLink(affiliateUrl, keyword) {
  if (!affiliateUrl || affiliateUrl.trim().length === 0) return null;
  
  // Create professional product names based on URL patterns or generic
  const urlPatterns = {
    'amazon.com': () => `premium ${keyword} solution`,
    'shopify.com': () => 'professional-grade platform',
    'clickfunnels.com': () => 'industry-leading system',
    'getresponse.com': () => 'comprehensive solution',
    'semrush.com': () => 'professional tool',
  };
  
  let linkText = `quality ${keyword} option`;
  for (const [domain, textGenerator] of Object.entries(urlPatterns)) {
    if (affiliateUrl.includes(domain)) {
      linkText = textGenerator();
      break;
    }
  }
  
  return {
    url: affiliateUrl,
    text: linkText,
    html: `<a href="${affiliateUrl}" target="_blank" rel="nofollow sponsored"><strong>${linkText}</strong></a>`
  };
}

function generateCTAVariations(keyword, company) {
  return [
    `When selecting ${keyword}, prioritize solutions with proven track records and professional support.`,
    `For optimal ${keyword} results, research thoroughly and consult with experienced professionals.`,
    `Quality ${keyword} requires careful evaluation of features, reliability, and long-term value.`,
    `Before making ${keyword} decisions, compare multiple options and read professional reviews.`,
    `Successful ${keyword} implementation benefits from expert guidance and proven methodologies.`,
    `${company ? `At ${company}, we recommend` : 'Industry professionals recommend'} prioritizing quality and reliability in ${keyword} selections.`
  ];
}

async function generateIntroductionWithStructure(inputData) {
  const { keyword, contentType, publication, sourceMaterial, affiliateLink, company } = inputData;
  const maskedLink = createMaskedAffiliateLink(affiliateLink, keyword);
  const ctas = generateCTAVariations(keyword, company);
  
  const prompt = `Write a professional article introduction following this EXACT structure for ${publication}:

# The Complete Guide to ${keyword}: Professional Insights

**Opening Hook:** Start with a compelling statistic or industry insight about ${keyword}.

**In This Article, You'll Discover:**
• The essential fundamentals every professional should know about ${keyword}
• Advanced strategies for maximizing ${keyword} effectiveness  
• Common mistakes to avoid and how to prevent them
• Professional recommendations for optimal results
• Action steps for immediate implementation

**TLDR:** This comprehensive guide covers everything professionals need to know about ${keyword}, from fundamental concepts to advanced implementation strategies, with actionable insights for immediate results.

**Main Introduction (400-500 words):**
Write a professional introduction that establishes authority and provides context. ${maskedLink ? `Naturally mention that professionals often recommend ${maskedLink.text} for reliable results.` : ''} Include one of these strategic CTAs: "${ctas[0]}"

CRITICAL REQUIREMENTS:
- Base ALL facts on the provided source material
- Maintain professional tone for ${publication}  
- Include natural affiliate integration if provided
- Use H2 and H3 headings appropriately

SOURCE MATERIAL (MANDATORY - Use as factual foundation):
${sourceMaterial}

Write ONLY the introduction section with the exact structure above.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0]?.text || '';
}

async function generateContentSection(inputData, sectionNumber, previousContent = '') {
  const { keyword, contentType, publication, sourceMaterial, affiliateLink, company } = inputData;
  const maskedLink = createMaskedAffiliateLink(affiliateLink, keyword);
  const ctas = generateCTAVariations(keyword, company);
  const shouldIncludeAffiliate = maskedLink && (sectionNumber === 2 || sectionNumber === 4);
  
  const contextPrompt = previousContent ? `\n\nPREVIOUS CONTENT CONTEXT (to ensure continuity):\n${previousContent.slice(-800)}` : '';
  
  const prompt = `Continue the professional ${contentType} about "${keyword}" with Section ${sectionNumber}.

TARGET: Write approximately 1200-1500 words for this section.

REQUIREMENTS:
- Create detailed, informative content about ${keyword}
- Use proper H2 and H3 headings for section structure
- Base all facts on the provided source material
- Include strategic CTA: "${ctas[sectionNumber - 1] || ctas[0]}"
${shouldIncludeAffiliate ? `- Naturally integrate this recommendation: For those seeking reliable ${keyword}, ${maskedLink.text} offers professional-grade features with proven results.` : ''}
- Maintain professional tone for ${publication}
- Provide actionable insights and practical information

${contextPrompt}

SOURCE MATERIAL (for factual accuracy):
${sourceMaterial}

Write Section ${sectionNumber} content that flows naturally from previous sections.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0]?.text || '';
}

async function generateConclusion(inputData, fullContent) {
  const { keyword, contentType, publication, sourceMaterial, affiliateLink, company } = inputData;
  const maskedLink = createMaskedAffiliateLink(affiliateLink, keyword);
  const ctas = generateCTAVariations(keyword, company);
  
  const prompt = `Create a compelling conclusion for the ${contentType} about "${keyword}".

TARGET: Write approximately 600-800 words for this conclusion.

REQUIREMENTS:
- Summarize key points from the entire article
- Provide clear action steps for readers
- Include final strategic CTA: "${ctas[ctas.length - 1]}"
${maskedLink ? `- Include final recommendation: Many professionals choose ${maskedLink.text} for its reliability and comprehensive support.` : ''}
- End with compelling call-to-action
- Maintain professional tone for ${publication}

ARTICLE CONTEXT (last 1000 characters):
${fullContent.slice(-1000)}

SOURCE MATERIAL (for factual accuracy):
${sourceMaterial}

Create a conclusion that ties everything together and motivates action.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0]?.text || '';
}

export default async function handler(req, res) {
  // CORS headers
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
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));

    const {
      contentType,
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

    console.log('Extracted fields:', { 
      contentType, 
      publication, 
      keyword, 
      wordCount, 
      hasAffiliate: !!affiliateLink, 
      hasSource: !!sourceMaterial,
      hasEmail: !!email,
      hasPhone: !!phone
    });

    // Validate required fields (Zero Failure Policy)
    if (!publication || !keyword || !wordCount) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Publication, keyword, and word count are required',
        received: { 
          publication: publication || 'MISSING', 
          keyword: keyword || 'MISSING', 
          wordCount: wordCount || 'MISSING' 
        },
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    if (!sourceMaterial || sourceMaterial.trim().length < 50) {
      console.log('Source material validation failed');
      return res.status(400).json({
        error: 'Source material is mandatory for factual accuracy',
        details: 'Minimum 50 characters required for zero-failure policy',
        received: { 
          sourceLength: sourceMaterial ? sourceMaterial.length : 0 
        },
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // Contact validation - require at least email OR phone
    if (!email && !phone) {
      console.log('Contact validation failed');
      return res.status(400).json({
        error: 'Contact information required',
        details: 'Please provide either email or phone number',
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    const targetWords = parseInt(wordCount) || 8000;
    const sectionsNeeded = Math.ceil(targetWords / 1500) - 1; // -1 because intro + conclusion
    
    console.log(`Starting multi-section generation: Introduction + ${sectionsNeeded} sections + Conclusion for ${targetWords} words`);

    // Generate content sections
    let finalContent = '';
    let generationErrors = [];

    try {
      // 1. Generate Introduction with required structure
      console.log('Generating introduction...');
      const introduction = await generateIntroductionWithStructure(req.body);
      if (!introduction || introduction.trim().length < 200) {
        throw new Error('Introduction generation failed or too short');
      }
      finalContent = introduction;
      
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Generate content sections
      for (let i = 1; i <= sectionsNeeded; i++) {
        console.log(`Generating section ${i}/${sectionsNeeded}...`);
        
        const sectionContent = await generateContentSection(req.body, i, finalContent);
        if (!sectionContent || sectionContent.trim().length < 200) {
          console.warn(`Section ${i} generated minimal content, continuing...`);
          generationErrors.push(`Section ${i} was shorter than expected`);
        }
        
        finalContent += '\n\n' + sectionContent;
        
        // Delay between sections
        if (i < sectionsNeeded) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 3. Generate conclusion
      console.log('Generating conclusion...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const conclusion = await generateConclusion(req.body, finalContent);
      if (!conclusion || conclusion.trim().length < 200) {
        console.warn('Conclusion generated minimal content, continuing...');
        generationErrors.push('Conclusion was shorter than expected');
      }
      
      finalContent += '\n\n' + conclusion;

    } catch (generationError) {
      console.error('Content generation error:', generationError);
      return res.status(500).json({
        error: 'Content generation failed',
        details: generationError.message,
        errorType: generationError.constructor.name,
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // Validate final content
    if (!finalContent || finalContent.trim().length < 500) {
      return res.status(500).json({
        error: 'Generated content is too short',
        details: `Generated ${finalContent?.length || 0} characters, expected minimum 500`,
        success: false,
        timestamp: new Date().toISOString()
      });
    }

    // Add FTC disclosure if affiliate links present
    if (affiliateLink) {
      finalContent += '\n\n---\n\n**FTC Disclosure:** This article contains affiliate links. We may receive compensation when you purchase through these links, at no additional cost to you. This helps support our research and allows us to continue providing professional insights. Our recommendations remain independent and are based on professional analysis and industry expertise.';
    }

    const wordEstimate = finalContent.split(/\s+/).length;
    const affiliateCount = affiliateLink ? (finalContent.match(/\[.*?\]\(.*?\)/g) || []).length : 0;

    console.log(`Content generation completed successfully: ${wordEstimate} words, ${affiliateCount} affiliate links`);

    // Success response
    res.status(200).json({
      success: true,
      content: finalContent,
      metadata: {
        wordCount: wordEstimate,
        targetWords: targetWords,
        affiliateLinks: affiliateCount,
        sections: sectionsNeeded + 2, // intro + sections + conclusion
        publication: publication,
        keyword: keyword,
        hasContactInfo: !!(email || phone),
        warnings: generationErrors.length > 0 ? generationErrors : null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message,
      errorType: error.constructor.name,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
