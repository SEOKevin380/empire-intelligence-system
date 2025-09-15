export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== EMPIRE INTELLIGENCE CONTENT GENERATION START ===');
    
    // Extract form data
    const { keyword, sourceMaterial, affiliateLink, wordCount, publication } = req.body;
    
    console.log('Request data received:');
    console.log('- Keyword:', keyword);
    console.log('- Word Count:', wordCount);
    console.log('- Publication:', publication);
    console.log('- Affiliate Link:', affiliateLink ? affiliateLink : 'None');
    console.log('- Source Material length:', sourceMaterial?.length || 0);

    // Validate required fields
    if (!keyword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Keyword is required'
      });
    }

    if (!sourceMaterial || sourceMaterial.length < 50) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Source Material must be at least 50 characters'
      });
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'API key not configured'
      });
    }

    console.log('API Key status:', apiKey ? 'Present' : 'Missing');

    const targetWords = parseInt(wordCount) || 8000;
    
    console.log(`Generating ${targetWords} word article...`);

    // Enhanced prompt for WordPress-ready content
    const prompt = `You are an expert SEO content writer specializing in WordPress-ready, publish-perfect articles. Create a comprehensive ${targetWords}-word article about "${keyword}" that is 100% ready for WordPress publishing by non-technical VAs.

## CRITICAL: WORDPRESS HTML FORMATTING REQUIRED

Format the ENTIRE article using proper HTML tags that can be copy-pasted directly into WordPress:

- <h1>Main Article Title</h1>
- <h2>Major Section Headers</h2>  
- <h3>Subsection Headers</h3>
- <p>All paragraph content in proper P tags</p>
- <strong>Bold important terms</strong>
- <em>Italicize key phrases</em>
- <a href="${affiliateLink || '#'}" target="_blank" rel="nofollow">Affiliate Link Text</a>

## MANDATORY WORDPRESS STRUCTURE:

**1. SEO META SECTION (First):**
<!-- SEO META DATA FOR WORDPRESS -->
<!-- Title: [60-character SEO title with keyword] -->
<!-- Meta Description: [150-character description with keyword] -->
<!-- Focus Keyphrase: ${keyword} -->
<!-- Categories: Health, Supplements, Wellness -->
<!-- Tags: mushroom gummies, ${keyword}, natural health, wellness supplements -->

**2. FEATURED IMAGE GUIDANCE:**
<!-- Featured Image: Suggest high-quality image of mushroom gummies -->
<!-- Alt Text: "${keyword} - Premium mushroom gummies for natural wellness" -->

**3. COMPLETE ARTICLE STRUCTURE:**

<h1>[SEO-Optimized Main Title with Keyword]</h1>

<p><strong>In This Article, You'll Discover:</strong></p>
[Clean list format - no bullets, just line breaks]

<h2>Introduction Section</h2>
<p>[400+ words with affiliate link CTA]</p>

<h2>Understanding [Topic] - Complete Guide</h2>
<p>[600+ words comprehensive section]</p>

<h3>Key Benefits and Features</h3>
<p>[Detailed subsection]</p>

<h2>Product Analysis and Comparison</h2>
<p>[600+ words with affiliate links]</p>

<h2>Scientific Research and Evidence</h2>
<p>[600+ words with studies and data]</p>

<h2>User Reviews and Testimonials</h2>
<p>[400+ words with social proof]</p>

<h2>Frequently Asked Questions</h2>
[Complete FAQ section with H3 questions and detailed answers]

<h2>Conclusion and Final Recommendations</h2>
<p>[400+ words with multiple affiliate link CTAs]</p>

## WORDPRESS PUBLISHING REQUIREMENTS:

1. **COMPLETE ${targetWords} WORDS** - Do not cut off mid-sentence
2. **AFFILIATE LINK INTEGRATION**: Use exact URL ${affiliateLink || 'NO LINK PROVIDED'} minimum 5 times with varied anchor text
3. **PROPER HTML FORMATTING**: Every element must use correct HTML tags
4. **SEO OPTIMIZATION**: Include keyword "${keyword}" naturally 8-12 times
5. **INTERNAL LINKING OPPORTUNITIES**: Suggest 3-5 places for internal links
6. **CALL-OUT BOXES**: Mark 2-3 sections that should be highlighted
7. **VA INSTRUCTIONS**: Include publishing checklist at end

## SOURCE MATERIAL TO USE EXTENSIVELY:
${sourceMaterial}

## AFFILIATE INTEGRATION REQUIREMENTS:
${affiliateLink ? `
- Use EXACT URL: ${affiliateLink}
- Include in introduction with "Based on our research, visit ${affiliateLink}"
- Mid-article: "Learn more at ${affiliateLink}" 
- Product sections: "Check current pricing at ${affiliateLink}"
- Conclusion: "Ready to try it? Visit ${affiliateLink} today"
- Use rel="nofollow" on ALL affiliate links
` : 'Include general product recommendation CTAs without specific links'}

## PUBLISHING CHECKLIST (Include at end):
- [ ] Title contains focus keyword
- [ ] Meta description under 160 characters  
- [ ] All headings use proper H1, H2, H3 tags
- [ ] Affiliate links use rel="nofollow"
- [ ] Images have alt text
- [ ] Content is ${targetWords}+ words
- [ ] Internal links added where suggested
- [ ] Categories and tags assigned

## CRITICAL: 
- Write the COMPLETE ${targetWords}-word article with proper HTML formatting
- DO NOT cut off mid-sentence or leave incomplete
- Include comprehensive FAQ section
- End with strong conclusion and publishing checklist
- Make it 100% copy-paste ready for WordPress

Generate the complete WordPress-ready article now:`;

    // Make Claude API call with multiple attempts for full content
    console.log('Making Claude API call for WordPress-ready content...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000, // Maximum tokens for complete content
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error Response:', errorText);
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch (e) {
        // Keep original error text if not JSON
      }
      
      return res.status(response.status).json({
        error: 'Content generation failed',
        details: `API Error ${response.status}: ${errorDetails}`
      });
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Invalid response structure from Claude API:', data);
      return res.status(500).json({
        error: 'Invalid response from content generation service',
        details: 'Response structure was unexpected'
      });
    }

    let generatedContent = data.content[0].text;
    
    // Enhanced post-processing for WordPress optimization
    if (affiliateLink) {
      // Ensure all affiliate links have proper attributes
      const affiliateLinkRegex = new RegExp(`href="${affiliateLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
      generatedContent = generatedContent.replace(affiliateLinkRegex, `href="${affiliateLink}" target="_blank" rel="nofollow"`);
      
      // Add FTC compliance at the top
      const ftcDisclaimer = `<!-- FTC COMPLIANCE -->\n<p><em><strong>FTC Disclosure:</strong> This post contains affiliate links. We may earn a commission if you make a purchase through our recommended links, at no additional cost to you. This helps support our research and content creation.</em></p>\n\n`;
      
      if (!generatedContent.includes('FTC Disclosure')) {
        generatedContent = ftcDisclaimer + generatedContent;
      }
    }
    
    // Add WordPress publishing checklist if not present
    if (!generatedContent.includes('PUBLISHING CHECKLIST')) {
      const publishingChecklist = `\n\n<h3>WordPress Publishing Checklist</h3>
<p><strong>Before publishing, ensure:</strong></p>
<ul>
<li>Title contains focus keyword "${keyword}"</li>
<li>Meta description is under 160 characters</li>
<li>All headings use proper H1, H2, H3 tags</li>
<li>Affiliate links use rel="nofollow" attribute</li>
<li>Featured image has proper alt text</li>
<li>Content is ${targetWords}+ words</li>
<li>Categories: Health, Supplements, Wellness</li>
<li>Tags: mushroom gummies, ${keyword}, natural health</li>
</ul>`;
      generatedContent += publishingChecklist;
    }

    const finalWordCount = generatedContent.replace(/<[^>]*>/g, '').split(' ').length;
    console.log(`WordPress-ready content generated: ${finalWordCount} words`);

    // Check if content meets minimum requirements
    const hasHTML = generatedContent.includes('<h1>') && generatedContent.includes('<h2>');
    const hasAffiliate = !affiliateLink || generatedContent.includes(affiliateLink);
    const meetsWordCount = finalWordCount >= (targetWords * 0.8); // Allow 80% of target

    console.log(`Content validation: HTML=${hasHTML}, Affiliate=${hasAffiliate}, WordCount=${meetsWordCount}`);

    console.log('=== EMPIRE INTELLIGENCE WORDPRESS CONTENT SUCCESS ===');

    // Return WordPress-optimized response
    return res.status(200).json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: finalWordCount,
        targetWordCount: targetWords,
        keyword: keyword,
        timestamp: new Date().toISOString(),
        affiliateLinkUsed: !!affiliateLink,
        wordpressReady: hasHTML,
        seoOptimized: true,
        publishReady: hasHTML && hasAffiliate && meetsWordCount,
        modelUsed: 'claude-sonnet-4-20250514'
      },
      publishingNotes: {
        title: `Suggested title with "${keyword}" keyword`,
        metaDescription: `Generated meta description under 160 chars with "${keyword}"`,
        categories: ['Health', 'Supplements', 'Wellness'],
        tags: ['mushroom gummies', keyword, 'natural health', 'wellness supplements'],
        featuredImageAlt: `${keyword} - Premium mushroom gummies for natural wellness`,
        internalLinkSuggestions: [
          'Link to related health articles',
          'Link to supplement comparison posts', 
          'Link to wellness category page'
        ]
      }
    });

  } catch (error) {
    console.error('=== EMPIRE INTELLIGENCE SYSTEM ERROR ===');
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);

    return res.status(500).json({
      error: 'Content generation failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
