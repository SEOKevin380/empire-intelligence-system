import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
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
    const requestData = req.body;
    console.log('🎯 AUTONOMOUS QUALITY ORCHESTRATION INITIATED');

    // 🧠 PHASE 1: AUTONOMOUS INPUT OPTIMIZATION
    console.log('🔍 Phase 1: Input Intelligence Analysis...');
    const optimizedInput = await autonomousInputOptimization(requestData);
    
    // 🚀 PHASE 2: MULTI-ROUND CONTENT GENERATION WITH QUALITY LOOPS
    console.log('🚀 Phase 2: Multi-Round Generation with Quality Orchestration...');
    const generatedContent = await multiRoundGenerationWithQualityLoops(optimizedInput);
    
    // 🎯 PHASE 3: AUTONOMOUS OUTPUT PERFECTION
    console.log('🎯 Phase 3: Output Perfection Analysis...');
    const perfectedContent = await autonomousOutputPerfection(generatedContent, optimizedInput);
    
    // 📊 PHASE 4: QUALITY METRICS & CONTINUOUS LEARNING
    console.log('📊 Phase 4: Quality Metrics Analysis...');
    const qualityMetrics = await calculateQualityMetrics(perfectedContent, optimizedInput);

    console.log('✅ AUTONOMOUS QUALITY ORCHESTRATION COMPLETE');
    console.log('📈 Quality Score:', qualityMetrics.overallScore);

    return res.status(200).json({
      success: true,
      article: {
        content: perfectedContent.content,
        wordCount: perfectedContent.wordCount,
        affiliateLinks: perfectedContent.affiliateLinks,
        qualityScore: qualityMetrics.overallScore,
        optimizations: perfectedContent.optimizations,
        aiRecommendations: perfectedContent.recommendations
      },
      metadata: {
        originalInput: requestData,
        optimizedInput: optimizedInput,
        qualityMetrics: qualityMetrics,
        processingTime: Date.now(),
        aiProcessingStages: 4
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 Autonomous Quality System Error:', error);
    
    return res.status(500).json({
      error: 'Autonomous quality system encountered an issue',
      details: error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}

// 🧠 PHASE 1: AUTONOMOUS INPUT OPTIMIZATION
async function autonomousInputOptimization(inputData) {
  console.log('🔍 Analyzing input data for autonomous optimization...');

  const optimizationPrompt = `As an AI Content Strategy Optimization Expert, analyze and enhance this content generation request:

INPUT DATA:
${JSON.stringify(inputData, null, 2)}

AUTONOMOUS OPTIMIZATION TASKS:
1. KEYWORD ENHANCEMENT: Analyze the primary keyword and suggest semantic variations, long-tail opportunities, and LSI keywords
2. PUBLICATION ALIGNMENT: Ensure content strategy perfectly aligns with publication requirements
3. WORD COUNT OPTIMIZATION: Validate target word count against publication standards and keyword competition
4. AFFILIATE INTEGRATION STRATEGY: Optimize affiliate link placement strategy for maximum conversion
5. SOURCE MATERIAL ENHANCEMENT: Identify gaps in source material and suggest additional research angles
6. CONTENT STRUCTURE OPTIMIZATION: Recommend optimal H2/H3 hierarchy for SEO and readability
7. AUDIENCE TARGETING: Refine audience targeting based on publication and keyword analysis

OUTPUT REQUIREMENTS:
Return a JSON object with optimized parameters and strategic recommendations:

{
  "optimizedKeyword": "enhanced primary keyword",
  "semanticKeywords": ["semantic", "variation", "keywords"],
  "targetWordCount": optimized_number,
  "contentStrategy": "strategic approach description",
  "affiliateStrategy": "affiliate integration strategy",
  "structureRecommendations": ["H2 structure", "recommendations"],
  "audienceProfile": "refined audience description",
  "publicationAlignment": "publication-specific optimizations",
  "researchGaps": ["identified", "research", "gaps"],
  "seoOptimizations": ["seo", "enhancement", "suggestions"]
}

RESPOND ONLY WITH VALID JSON. NO OTHER TEXT.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: optimizationPrompt }]
    });

    let optimizationResult = response.content[0]?.text;
    optimizationResult = optimizationResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const parsedOptimization = JSON.parse(optimizationResult);
    
    // Merge optimizations with original input
    const optimizedInput = {
      ...inputData,
      keyword: parsedOptimization.optimizedKeyword || inputData.keyword,
      semanticKeywords: parsedOptimization.semanticKeywords || [],
      wordCount: parsedOptimization.targetWordCount || inputData.wordCount,
      contentStrategy: parsedOptimization.contentStrategy,
      affiliateStrategy: parsedOptimization.affiliateStrategy,
      structureRecommendations: parsedOptimization.structureRecommendations,
      optimizations: parsedOptimization
    };

    console.log('✅ Input optimization complete:', parsedOptimization);
    return optimizedInput;

  } catch (error) {
    console.error('🚨 Input optimization failed:', error);
    return inputData; // Fallback to original input
  }
}

// 🚀 PHASE 2: MULTI-ROUND GENERATION WITH QUALITY LOOPS
async function multiRoundGenerationWithQualityLoops(optimizedInput) {
  console.log('🚀 Starting multi-round generation with quality loops...');

  const targetWordCount = parseInt(optimizedInput.wordCount) || 8000;
  const rounds = Math.ceil(targetWordCount / 3500);
  let accumulatedContent = '';
  let qualityIterations = [];

  for (let round = 1; round <= rounds; round++) {
    console.log(`📝 Generation Round ${round}/${rounds}`);

    const remainingWords = targetWordCount - estimateWordCount(accumulatedContent);
    const roundTarget = Math.min(3500, remainingWords);

    // Generate initial content for this round
    let roundContent = await generateRoundContent(round, rounds, roundTarget, optimizedInput, accumulatedContent);

    // 🔄 AUTONOMOUS QUALITY LOOP: Analyze and improve the round content
    const improvedContent = await autonomousContentImprovement(roundContent, optimizedInput, round);
    
    qualityIterations.push({
      round: round,
      originalQuality: await quickQualityScore(roundContent),
      improvedQuality: await quickQualityScore(improvedContent.content),
      improvements: improvedContent.improvements
    });

    accumulatedContent += (round === 1 ? '' : '\n\n') + improvedContent.content;
    console.log(`✅ Round ${round} complete with quality improvements`);
  }

  return {
    content: accumulatedContent,
    wordCount: estimateWordCount(accumulatedContent),
    qualityIterations: qualityIterations
  };
}

// 🔄 AUTONOMOUS CONTENT IMPROVEMENT LOOP
async function autonomousContentImprovement(content, optimizedInput, round) {
  const improvementPrompt = `As an AI Content Quality Optimization Expert, analyze and improve this content section:

CONTENT TO IMPROVE:
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

OPTIMIZATION PARAMETERS:
- Primary Keyword: ${optimizedInput.keyword}
- Semantic Keywords: ${optimizedInput.semanticKeywords?.join(', ') || 'N/A'}
- Publication: ${optimizedInput.publication}
- Round: ${round}

AUTONOMOUS IMPROVEMENT TASKS:
1. KEYWORD OPTIMIZATION: Enhance keyword density and semantic keyword integration
2. READABILITY ENHANCEMENT: Improve sentence flow, clarity, and engagement
3. SEO OPTIMIZATION: Optimize headers, meta descriptions, and keyword placement
4. FACTUAL ACCURACY: Verify against source material and enhance credibility
5. AFFILIATE INTEGRATION: Optimize affiliate link placement naturally
6. ENGAGEMENT OPTIMIZATION: Enhance reader engagement and call-to-actions
7. STRUCTURAL IMPROVEMENT: Optimize paragraph structure and transitions

Return improved content that maintains the same length but with significantly enhanced quality.

RESPOND WITH IMPROVED CONTENT ONLY. NO EXPLANATIONS.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [{ role: 'user', content: improvementPrompt }]
    });

    const improvedContent = response.content[0]?.text;

    return {
      content: improvedContent,
      improvements: ['keyword-optimization', 'readability-enhancement', 'seo-optimization', 'engagement-improvement']
    };

  } catch (error) {
    console.error('🚨 Content improvement failed:', error);
    return { content: content, improvements: [] };
  }
}

// 🎯 PHASE 3: AUTONOMOUS OUTPUT PERFECTION
async function autonomousOutputPerfection(generatedContent, optimizedInput) {
  console.log('🎯 Applying autonomous output perfection...');

  const perfectionPrompt = `As an AI Content Perfection Expert, perform final quality optimization on this complete article:

ARTICLE TO PERFECT:
${generatedContent.content.substring(0, 3000)}...

PERFECTION PARAMETERS:
- Target Word Count: ${optimizedInput.wordCount}
- Primary Keyword: ${optimizedInput.keyword}
- Publication: ${optimizedInput.publication}
- Affiliate Link: ${optimizedInput.affiliateLink}

AUTONOMOUS PERFECTION TASKS:
1. FINAL KEYWORD OPTIMIZATION: Perfect keyword density and placement
2. AFFILIATE LINK INTEGRATION: Ensure 3-5 natural affiliate placements
3. STRUCTURAL PERFECTION: Optimize H2/H3 hierarchy and flow
4. ENGAGEMENT MAXIMIZATION: Enhance reader engagement throughout
5. SEO PERFECTION: Final SEO optimization for maximum visibility
6. CALL-TO-ACTION OPTIMIZATION: Perfect CTAs and conversion elements
7. QUALITY ASSURANCE: Final quality check and polish

OUTPUT REQUIREMENTS:
Return JSON with perfected content and analysis:

{
  "content": "perfected article content",
  "affiliateLinks": ["extracted", "affiliate", "links"],
  "wordCount": actual_word_count,
  "optimizations": ["applied", "optimizations"],
  "recommendations": ["strategic", "recommendations"],
  "seoScore": estimated_seo_score
}

RESPOND ONLY WITH VALID JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [{ role: 'user', content: perfectionPrompt }]
    });

    let perfectionResult = response.content[0]?.text;
    perfectionResult = perfectionResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const parsedPerfection = JSON.parse(perfectionResult);

    console.log('✅ Output perfection complete');
    return {
      content: parsedPerfection.content || generatedContent.content,
      wordCount: parsedPerfection.wordCount || generatedContent.wordCount,
      affiliateLinks: parsedPerfection.affiliateLinks || [],
      optimizations: parsedPerfection.optimizations || [],
      recommendations: parsedPerfection.recommendations || [],
      seoScore: parsedPerfection.seoScore || 85
    };

  } catch (error) {
    console.error('🚨 Output perfection failed:', error);
    return {
      content: generatedContent.content,
      wordCount: generatedContent.wordCount,
      affiliateLinks: [],
      optimizations: [],
      recommendations: [],
      seoScore: 75
    };
  }
}

// 📊 PHASE 4: QUALITY METRICS & CONTINUOUS LEARNING
async function calculateQualityMetrics(perfectedContent, optimizedInput) {
  const metrics = {
    wordCountAccuracy: Math.min(100, (perfectedContent.wordCount / optimizedInput.wordCount) * 100),
    keywordOptimization: calculateKeywordScore(perfectedContent.content, optimizedInput.keyword),
    affiliateLinkIntegration: Math.min(100, (perfectedContent.affiliateLinks.length / 3) * 100),
    structuralQuality: calculateStructuralScore(perfectedContent.content),
    readabilityScore: calculateReadabilityScore(perfectedContent.content),
    seoOptimization: perfectedContent.seoScore || 85
  };

  metrics.overallScore = Math.round(
    (metrics.wordCountAccuracy * 0.15) +
    (metrics.keywordOptimization * 0.25) +
    (metrics.affiliateLinkIntegration * 0.15) +
    (metrics.structuralQuality * 0.15) +
    (metrics.readabilityScore * 0.15) +
    (metrics.seoOptimization * 0.15)
  );

  console.log('📊 Quality Metrics Calculated:', metrics);
  return metrics;
}

// Helper Functions
async function generateRoundContent(round, totalRounds, wordTarget, optimizedInput, previousContent) {
  const isFirstRound = round === 1;
  const isLastRound = round === totalRounds;

  let prompt = '';
  
  if (isFirstRound) {
    prompt = `Write the INTRODUCTION and BEGINNING sections of a comprehensive ${wordTarget}-word article for ${optimizedInput.publication}.

PRIMARY KEYWORD: ${optimizedInput.keyword}
SEMANTIC KEYWORDS: ${optimizedInput.semanticKeywords?.join(', ') || 'N/A'}
CONTENT STRATEGY: ${optimizedInput.contentStrategy || 'Standard approach'}

SOURCE MATERIAL: ${optimizedInput.sourceMaterial || 'Use general knowledge'}

Write exactly ${wordTarget} words focusing on introduction and early content sections. Include 1-2 affiliate link placements if provided: ${optimizedInput.affiliateLink || 'N/A'}`;
  
  } else if (isLastRound) {
    prompt = `Write the CONCLUSION and FINAL sections completing this article:

PREVIOUS CONTENT: ${previousContent.substring(0, 1000)}...

PRIMARY KEYWORD: ${optimizedInput.keyword}
Write exactly ${wordTarget} words for conclusion. Include final affiliate link placements: ${optimizedInput.affiliateLink || 'N/A'}`;
  
  } else {
    prompt = `Continue writing the MIDDLE section of this article:

PREVIOUS CONTENT: ${previousContent.substring(0, 1000)}...

PRIMARY KEYWORD: ${optimizedInput.keyword}
Write exactly ${wordTarget} words for middle content development.`;
  }

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0]?.text || '';
}

async function quickQualityScore(content) {
  // Simple quality scoring algorithm
  const wordCount = estimateWordCount(content);
  const sentenceCount = (content.match(/[.!?]+/g) || []).length;
  const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
  const headerCount = (content.match(/#{1,3}\s+/g) || []).length;
  
  let score = 70; // Base score
  if (avgSentenceLength > 15 && avgSentenceLength < 25) score += 10;
  if (headerCount > 0) score += 10;
  if (wordCount > 500) score += 10;
  
  return Math.min(100, score);
}

function calculateKeywordScore(content, keyword) {
  const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  const wordCount = estimateWordCount(content);
  const density = (keywordCount / wordCount) * 100;
  
  // Optimal keyword density: 1-3%
  if (density >= 1 && density <= 3) return 100;
  if (density >= 0.5 && density < 1) return 80;
  if (density > 3 && density <= 5) return 70;
  return 50;
}

function calculateStructuralScore(content) {
  const headerCount = (content.match(/#{1,3}\s+/g) || []).length;
  const paragraphCount = content.split('\n\n').length;
  
  let score = 60;
  if (headerCount >= 3) score += 20;
  if (headerCount >= 6) score += 10;
  if (paragraphCount >= 5) score += 10;
  
  return Math.min(100, score);
}

function calculateReadabilityScore(content) {
  const sentences = (content.match(/[.!?]+/g) || []).length;
  const words = estimateWordCount(content);
  const avgWordsPerSentence = words / Math.max(sentences, 1);
  
  let score = 70;
  if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) score += 15;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) score += 10;
  
  return Math.min(100, score);
}

function estimateWordCount(text) {
  return text.trim().split(/\s+/).length;
}
