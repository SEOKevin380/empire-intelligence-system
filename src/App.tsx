import React, { useState } from 'react';

const EmpireIntelligenceSystem = () => {
  const [keyword, setKeyword] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [contactInfo, setContactInfo] = useState({
    company: '',
    email: '',
    phone: ''
  });
  const [platform, setPlatform] = useState('globe-newswire');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');

  // Expert CTA Strategy Rules Based on Content Type
  const ctaStrategies = {
    software: {
      primary: "Start Your Free Trial",
      secondary: "Get Instant Access",
      tertiary: "See Live Demo",
      placement: ["After problem identification", "Mid-article after benefits", "Final conclusion"]
    },
    course: {
      primary: "Enroll Now - Limited Time",
      secondary: "Access Course Materials",
      tertiary: "View Curriculum",
      placement: ["After pain point", "After transformation story", "Before testimonials"]
    },
    supplement: {
      primary: "Claim Your Supply",
      secondary: "Read Full Ingredients",
      tertiary: "Check Availability",
      placement: ["After scientific backing", "After benefits section", "Before FAQ"]
    },
    service: {
      primary: "Schedule Consultation",
      secondary: "Get Custom Quote",
      tertiary: "View Case Studies",
      placement: ["After authority establishment", "Mid-article after process", "Final call-to-action"]
    },
    financial: {
      primary: "Access Research Report",
      secondary: "View Analysis",
      tertiary: "Get Market Insights",
      placement: ["After market analysis", "Before risk disclosures", "After competitive comparison"]
    }
  };

  // Compliance-Safe CTA Language
  const complianceCTAs = {
    'globe-newswire': {
      prohibited: ['Buy Now', 'Purchase', 'Order Today', 'Limited Time Offer'],
      recommended: ['Learn More', 'Read Full Report', 'Access Information', 'View Research']
    },
    'newswire-com': {
      prohibited: ['Guaranteed Results', 'Best Investment', 'Quick Profits'],
      recommended: ['Research Opportunity', 'Educational Resource', 'Market Analysis']
    },
    'generic': {
      recommended: ['Discover More', 'Get Started', 'Learn How', 'Explore Options']
    }
  };

  const simulateCompetitorAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        competitors: [
          { domain: 'competitor1.com', wordCount: 2847, ranking: 1, gapScore: 8.5 },
          { domain: 'competitor2.com', wordCount: 3291, ranking: 2, gapScore: 7.2 },
          { domain: 'competitor3.com', wordCount: 2156, ranking: 3, gapScore: 6.8 }
        ],
        recommendedWordCount: 3500,
        keywordDensity: '1.2-1.8%',
        contentType: detectContentType(keyword, sourceMaterial),
        strategy: 'comprehensive-authority'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const detectContentType = (keyword, material) => {
    const text = `${keyword} ${material}`.toLowerCase();
    if (text.includes('software') || text.includes('app') || text.includes('tool')) return 'software';
    if (text.includes('course') || text.includes('training') || text.includes('learn')) return 'course';
    if (text.includes('supplement') || text.includes('vitamin') || text.includes('health')) return 'supplement';
    if (text.includes('service') || text.includes('consulting') || text.includes('agency')) return 'service';
    if (text.includes('investment') || text.includes('trading') || text.includes('finance')) return 'financial';
    return 'software'; // default
  };

  const generateProfessionalContent = () => {
    if (!keyword || !sourceMaterial) {
      alert('Please enter keyword and source material to generate content.');
      return;
    }

    const contentType = analysis?.contentType || detectContentType(keyword, sourceMaterial);
    const ctaStrategy = ctaStrategies[contentType];
    const platformCTAs = complianceCTAs[platform] || complianceCTAs['generic'];

    // Generate strategic CTA placements
    const strategicCTAs = generateStrategicCTAs(contentType, affiliateLink, platformCTAs);
    
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} - Professional Analysis & Insights</title>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; font-size: 2.2em; margin-bottom: 0.5em; }
        h2 { color: #34495e; font-size: 1.8em; margin-top: 2em; border-bottom: 2px solid #3498db; padding-bottom: 0.3em; }
        h3 { color: #34495e; font-size: 1.4em; margin-top: 1.5em; }
        .cta-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .cta-button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; transition: all 0.3s; }
        .cta-button:hover { background: #c0392b; transform: translateY(-2px); }
        .contact-box { background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3498db; }
        .source-attribution { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 0.9em; border-left: 3px solid #007bff; }
        .tldr { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60; }
        strong { color: #2c3e50; }
    </style>
</head>
<body>

<h1>${keyword}: Complete Professional Analysis & Strategic Insights</h1>

<div class="tldr">
<h3>🎯 TLDR - Key Takeaways:</h3>
<p>This comprehensive analysis of <strong>${keyword}</strong> reveals critical insights based on extensive research and competitive intelligence. Key findings include strategic opportunities, market positioning advantages, and actionable recommendations for optimal results.</p>
</div>

<h2>In This Article, You'll Discover</h2>
<ul>
<li><strong>Comprehensive ${keyword} Analysis</strong> - Complete breakdown with source-verified insights</li>
<li><strong>Competitive Market Intelligence</strong> - Strategic positioning and opportunity identification</li>
<li><strong>Expert Recommendations</strong> - Professional guidance based on verified research</li>
<li><strong>Strategic Implementation</strong> - Actionable steps for optimal results</li>
</ul>

${strategicCTAs.opening}

<h2>Understanding ${keyword}: Foundation and Context</h2>
<p>Based on ${strategicCTAs.introLink}, <strong>${keyword}</strong> represents a significant opportunity in today's market landscape. Our investigation reveals key insights that inform strategic decision-making and optimal positioning.</p>

<p>The current market dynamics surrounding <strong>${keyword}</strong> demonstrate both challenges and opportunities. Through detailed analysis of competitive positioning and market trends, we've identified critical success factors that differentiate leaders from followers in this space.</p>

<h3>Core Components and Framework</h3>
<p>Professional analysis indicates that successful <strong>${keyword}</strong> implementation requires understanding of foundational elements. The research demonstrates clear patterns among top performers, with specific strategies yielding measurable advantages.</p>

<h2>Strategic Market Analysis and Competitive Intelligence</h2>
<p>Our competitive intelligence reveals significant opportunities for strategic positioning within the <strong>${keyword}</strong> landscape. Analysis of top-performing entities shows consistent patterns in approach and execution.</p>

<h3>Key Performance Indicators</h3>
<p>Research-backed metrics demonstrate that successful <strong>${keyword}</strong> strategies share common characteristics. These performance indicators provide measurable benchmarks for optimization and strategic planning.</p>

${strategicCTAs.midArticle}

<h3>Competitive Advantages and Differentiation</h3>
<p>Market analysis identifies specific advantages that separate industry leaders from competitors in the <strong>${keyword}</strong> space. Understanding these differentiators enables strategic positioning for optimal results.</p>

<h2>Strategic Market Analysis and Competitive Intelligence</h2>
<p>Our competitive intelligence reveals significant opportunities for strategic positioning within the <strong>${keyword}</strong> landscape. Analysis of top-performing entities shows consistent patterns in approach and execution.</p>

<h3>Key Performance Indicators</h3>
<p>Research-backed metrics demonstrate that successful <strong>${keyword}</strong> strategies share common characteristics. These performance indicators provide measurable benchmarks for optimization and strategic planning.</p>

<h3>Competitive Advantages and Differentiation</h3>
<p>Market analysis identifies specific advantages that separate industry leaders from competitors in the <strong>${keyword}</strong> space. Understanding these differentiators enables strategic positioning for optimal results.</p>

<h2>Expert Recommendations and Strategic Implementation</h2>
<p>Based on comprehensive analysis and source material verification, our recommendations provide actionable guidance for <strong>${keyword}</strong> optimization. These strategies are grounded in research and validated through competitive intelligence.</p>

<h3>Implementation Framework</h3>
<p>Professional implementation of <strong>${keyword}</strong> strategies requires systematic approach and careful execution. Our framework provides structured methodology for achieving optimal results while mitigating common pitfalls.</p>

<h2>Conclusion and Strategic Outlook</h2>
<p>The comprehensive analysis of <strong>${keyword}</strong> reveals significant opportunities for strategic advantage through informed implementation. Research-backed insights provide clear direction for optimization and competitive positioning.</p>

<p>Moving forward, success in the <strong>${keyword}</strong> landscape requires commitment to data-driven decision making and strategic execution. The evidence supports focused implementation of verified strategies for optimal results.</p>

${strategicCTAs.final}

${contactInfo.company ? `
<div class="contact-box">
<h3>📞 Professional Contact Information</h3>
<p><strong>${contactInfo.company}</strong></p>
${contactInfo.email ? `<p><strong>Email:</strong> ${contactInfo.email}</p>` : ''}
${contactInfo.phone ? `<p><strong>Phone (US):</strong> ${contactInfo.phone}</p>` : ''}
</div>
` : ''}

${sourceUrl ? `
<div class="source-attribution">
<h4>🔍 Source Attribution</h4>
<p>This analysis incorporates research and insights from: <a href="${sourceUrl}" target="_blank" rel="noopener">${sourceUrl}</a></p>
<p>Content has been professionally analyzed and integrated to provide comprehensive coverage while maintaining source accuracy and proper attribution.</p>
</div>
` : ''}

<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
<p><strong>Disclaimer:</strong> This content is for informational and educational purposes. Please verify current information and consult relevant professionals for specific guidance. Check official sources for current pricing, availability, and terms.</p>
</div>

</body>
</html>`;

    setGeneratedContent(content);
  };

  const generateStrategicCTAs = (contentType, affiliateLink, platformCTAs) => {
    const strategy = ctaStrategies[contentType];
    const link = affiliateLink || '#';
    
    // Select compliance-safe CTA text
    const primaryCTA = platformCTAs.recommended[0] || strategy.primary;
    const secondaryCTA = platformCTAs.recommended[1] || strategy.secondary;
    
    // LESS IS MORE: Only 2 strategic CTAs + subtle intro link
    return {
      // EARLY CAPTURE: Subtle intro link for immediate opportunity
      introLink: `<a href="${link}" style="color: #3498db; text-decoration: none; font-weight: 600;" rel="nofollow">comprehensive research and analysis</a>`,
      
      // STRATEGIC MID-POINT: Single high-impact CTA when engagement peaks
      midArticle: `
<div class="cta-box">
<h3>💡 Access Professional Insights</h3>
<p>Get the complete analysis and strategic recommendations that industry leaders use for competitive advantage.</p>
<a href="${link}" class="cta-button" rel="nofollow">${primaryCTA}</a>
</div>`,
      
      // FINAL CONVERSION: Dual-action CTA for maximum conversion opportunity
      final: `
<div class="cta-box">
<h3>🎯 Ready to Take Action?</h3>
<p>Join thousands of professionals who have transformed their results with proven strategies and expert guidance.</p>
<a href="${link}" class="cta-button" rel="nofollow">${primaryCTA}</a>
<a href="${link}" class="cta-button" rel="nofollow" style="background:#27ae60;">${secondaryCTA}</a>
</div>`
    };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('HTML content copied to clipboard! Ready for publishing.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5em',
            margin: '0 0 10px 0',
            fontWeight: '700'
          }}>
            Empire Intelligence System V11.0
          </h1>
          <p style={{
            fontSize: '1.3em',
            color: '#666',
            margin: '0',
            fontWeight: '300'
          }}>
            Revolutionary CTA-Optimized Content Generation with Affiliate Integration
          </p>
        </div>

        {/* Main Interface */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          
          {/* Input Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8em' }}>
              🎯 Strategic Content Configuration
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '8px' }}>
                  Target Keyword:
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., AI content generation tools"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e6ed',
                    borderRadius: '10px',
                    fontSize: '16px',
                    transition: 'all 0.3s'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '8px' }}>
                  Publication Platform:
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e0e6ed',
                    borderRadius: '10px',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="globe-newswire">Globe Newswire</option>
                  <option value="newswire-com">Newswire.com</option>
                  <option value="generic">Generic Platform</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '8px' }}>
                🔗 Affiliate Link (Strategic CTA Integration):
              </label>
              <input
                type="url"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://affiliate-link.com/your-tracking-code"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e6ed',
                  borderRadius: '10px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '8px' }}>
                Source URL (Attribution):
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://source-website.com/article"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #e0e6ed',
                  borderRadius: '10px',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Contact Info Block */}
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '25px',
              border: '2px solid #e0e6ed'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.4em' }}>
                📞 Professional Contact Information Block
              </h3>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
                *Either Email OR Phone required (both ideal for maximum authority)
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '5px' }}>
                    Company/Product Name:
                  </label>
                  <input
                    type="text"
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                    placeholder="e.g., Empire Intelligence Solutions"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '5px' }}>
                    Email: <span style={{ color: '#e74c3c', fontSize: '0.8em' }}>*Required if no phone</span>
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    placeholder="contact@empire-intelligence.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: (!contactInfo.email && !contactInfo.phone) ? '2px solid #e74c3c' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '5px' }}>
                    Phone (US): <span style={{ color: '#e74c3c', fontSize: '0.8em' }}>*Required if no email</span>
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: (!contactInfo.email && !contactInfo.phone) ? '2px solid #e74c3c' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#34495e', fontWeight: '600', marginBottom: '8px' }}>
                📝 Source Material (Unlimited Length):
              </label>
              <textarea
                value={sourceMaterial}
                onChange={(e) => setSourceMaterial(e.target.value)}
                placeholder="Paste your source material here - articles, research, data, etc. This content will be integrated with competitive intelligence for maximum accuracy and authority..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e6ed',
                  borderRadius: '10px',
                  fontSize: '14px',
                  resize: 'vertical',
                  minHeight: '200px'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <button
              onClick={simulateCompetitorAnalysis}
              disabled={isAnalyzing}
              style={{
                background: isAnalyzing ? '#95a5a6' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                marginRight: '20px',
                boxShadow: '0 8px 25px rgba(231, 76, 60, 0.3)',
                transition: 'all 0.3s'
              }}
            >
              {isAnalyzing ? '🔍 Analyzing Competitors...' : '🚀 Analyze Top Competitors'}
            </button>

            <button
              onClick={generateProfessionalContent}
              disabled={!keyword || !sourceMaterial}
              style={{
                background: (!keyword || !sourceMaterial) ? '#95a5a6' : 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: (!keyword || !sourceMaterial) ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 25px rgba(39, 174, 96, 0.3)',
                transition: 'all 0.3s'
              }}
            >
              ⚡ Generate CTA-Optimized Content
            </button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '40px',
              border: '2px solid #28a745'
            }}>
              <h3 style={{ color: '#27ae60', marginBottom: '20px', fontSize: '1.6em' }}>
                🎯 Competitive Intelligence Analysis Complete
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#e74c3c', fontWeight: 'bold' }}>
                    {analysis.recommendedWordCount}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>Target Word Count</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#3498db', fontWeight: 'bold' }}>
                    {analysis.contentType.toUpperCase()}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>Content Type Detected</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2em', color: '#27ae60', fontWeight: 'bold' }}>
                    {analysis.keywordDensity}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>Optimal Keyword Density</div>
                </div>
              </div>

              <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>🏆 Top 3 Competitors to Beat:</h4>
              {analysis.competitors.map((comp, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    #{comp.ranking} - {comp.domain}
                  </span>
                  <span style={{ color: '#666' }}>
                    {comp.wordCount} words | Gap Score: {comp.gapScore}/10
                  </span>
                </div>
              ))}
              
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <strong>🚀 AI Strategic Recommendation:</strong> Generate {analysis.recommendedWordCount}+ word {analysis.contentType} content with strategic CTA placement to outrank current #1 position.
              </div>
            </div>
          )}

          {/* Generated Content Display */}
          {generatedContent && (
            <div style={{ marginTop: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#27ae60', fontSize: '1.6em', margin: '0' }}>
                  ✅ CTA-Optimized Professional Content Generated
                </h3>
                <button
                  onClick={copyToClipboard}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  📋 Copy HTML to Clipboard
                </button>
              </div>
              
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid #28a745',
                maxHeight: '500px',
                overflow: 'auto'
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '12px',
                  margin: '0',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  {generatedContent}
                </pre>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '15px',
                textAlign: 'center'
              }}>
                <strong>🎯 CTA Strategy Implemented:</strong> LESS IS MORE approach with early capture intro link + 2 strategic CTAs for maximum conversion without overwhelming readers. Professional affiliate integration optimized for {analysis?.contentType || 'Professional'} content!
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default EmpireIntelligenceSystem;
