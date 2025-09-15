export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyword, sourceMaterial, affiliateLink, wordCount, publication, company, email, phone } = req.body;

    // Validation
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    if (!sourceMaterial || sourceMaterial.length < 50) {
      return res.status(400).json({ error: 'Source material must be at least 50 characters' });
    }

    if (!publication) {
      return res.status(400).json({ error: 'Publication is required' });
    }

    const targetWords = parseInt(wordCount) || 8000;

    // Enhanced prompt with specific requirements
    const prompt = `You are a world-class content writer specializing in SEO-optimized, affiliate-ready articles. Create a comprehensive ${targetWords}-word article about "${keyword}" using ONLY the provided source material as your factual foundation.

CRITICAL REQUIREMENTS:

1. AFFILIATE LINK INTEGRATION: Include the affiliate link "${affiliateLink}" naturally throughout the content at least 3-4 times with compelling call-to-action phrases.

2. "IN THIS ARTICLE" SECTION: Create a clean, professional section titled "In This Article, You'll Discover:" featuring 6-7 sentence-style points. DO NOT use bullet symbols (•, –, *, etc.) or emojis. Each line should be a full sentence starting with a capital letter, formatted as standalone lines without special characters. Example format:
"In This Article, You'll Discover:
What mushroom gummies are and why they're becoming essential for modern wellness
The complete ingredient breakdown of the top-rated mushroom gummies on the market
How these supplements support weight loss, focus, and stress management simultaneously"

3. FOUR-GOAL STRUCTURE: Organize content around these 4 primary goals:
   - Goal 1: Educate about ${keyword} and their benefits
   - Goal 2: Build trust through science and testimonials  
   - Goal 3: Address concerns and comparisons
   - Goal 4: Drive action with clear purchasing guidance

4. SEO OPTIMIZATION:
   - Use "${keyword}" as the primary keyword throughout
   - Include variations like "best ${keyword}", "${keyword} benefits", "${keyword} reviews"
   - Natural keyword density of 1-2%
   - Compelling meta-worthy title and headers

5. CONVERSION ELEMENTS:
   - Multiple compelling calls-to-action
   - Urgency and scarcity where appropriate
   - Social proof and testimonials
   - Clear value propositions

6. PROFESSIONAL STRUCTURE:
   - Engaging title optimized for SEO
   - "In This Article, You'll Discover:" section (clean format as specified)
   - TLDR section with key benefits
   - 8-12 substantial sections with descriptive headers
   - FAQ section
   - Strong conclusion with final CTA

7. FACTUAL ACCURACY: Base ALL claims strictly on the provided source material. Do not invent facts, statistics, or claims not supported by the source content.

8. COMPLIANCE: Include appropriate health disclaimers and FTC compliance statements for affiliate content.

SOURCE MATERIAL TO USE EXCLUSIVELY:
${sourceMaterial}

PUBLICATION: ${publication}
TARGET WORD COUNT: ${targetWords} words
COMPANY: ${company || 'N/A'}

Create content that drives conversions while maintaining journalistic integrity and SEO best practices. Focus on providing genuine value while naturally guiding readers toward the affiliate link.`;

    console.log('Sending prompt to Claude API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API Error:', response.status, errorData);
      return res.status(500).json({ 
        error: `Content generation failed: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    const generatedContent = data.content?.[0]?.text;

    if (!generatedContent) {
      console.error('No content in Claude response:', data);
      return res.status(500).json({ error: 'No content generated' });
    }

    // Estimate word count
    const wordCount_estimate = generatedContent.split(/\s+/).length;

    console.log('Content generated successfully');
    return res.status(200).json({
      success: true,
      content: generatedContent,
      metadata: {
        wordCount: wordCount_estimate,
        keyword,
        publication,
        affiliateLink: affiliateLink || 'None provided',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in generate-content API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
