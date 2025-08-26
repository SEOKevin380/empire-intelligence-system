import React, { useState } from 'react';

const EmpireIntelligenceSystem = () => {
  const [userRole, setUserRole] = useState('team'); // 'team', 'admin'
  const [currentStep, setCurrentStep] = useState('input');
  
  // Core VA Input Data
  const [formData, setFormData] = useState({
    keyword: '',
    sourceUrl: '',
    affiliateLink: '',
    sourceMaterial: '',
    selectedPrompt: '',
    selectedPublication: '',
    selectedSite: ''
  });

  // System Configuration (Admin Editable)
  const [systemConfig, setSystemConfig] = useState({
    publications: {
      'globe-newswire': { name: 'Globe Newswire', type: 'publication', active: true },
      'newswire': { name: 'Newswire', type: 'publication', active: true },
      'sponsored-article': { name: 'Sponsored Article', type: 'publication', active: true },
      'our-sites': { name: 'Our Sites', type: 'site-selector', active: true }
    },
    ownSites: {
      'healthtrends': { name: 'HealthTrends.com', url: 'https://healthtrends.com', active: true },
      'techinsights': { name: 'TechInsights.net', url: 'https://techinsights.net', active: true },
      'financewatch': { name: 'FinanceWatch.org', url: 'https://financewatch.org', active: true }
    },
    prompts: {
      'product-review': { 
        name: 'Product Review', 
        template: 'Write a comprehensive product review focusing on [KEYWORD]. Include benefits, features, and user experiences.',
        active: true 
      },
      'news-announcement': { 
        name: 'News Announcement', 
        template: 'Create a professional news announcement about [KEYWORD]. Focus on industry impact and company achievements.',
        active: true 
      },
      'health-supplement': { 
        name: 'Health Supplement Focus', 
        template: 'Write an in-depth article about [KEYWORD] health benefits, ingredients, and scientific backing.',
        active: true 
      },
      'tech-innovation': { 
        name: 'Tech Innovation', 
        template: 'Create a technology-focused article about [KEYWORD]. Cover innovation, market impact, and future potential.',
        active: true 
      }
    }
  });

  // Content Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);

  // Admin Functions
  const addPublication = () => {
    const name = prompt('Publication Name:');
    if (name) {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSystemConfig(prev => ({
        ...prev,
        publications: {
          ...prev.publications,
          [id]: { name, type: 'publication', active: true }
        }
      }));
    }
  };

  const addOwnSite = () => {
    const name = prompt('Site Name:');
    const url = prompt('Site URL:');
    if (name && url) {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSystemConfig(prev => ({
        ...prev,
        ownSites: {
          ...prev.ownSites,
          [id]: { name, url, active: true }
        }
      }));
    }
  };

  const addPrompt = () => {
    const name = prompt('Prompt Name:');
    const template = prompt('Prompt Template (use [KEYWORD] as placeholder):');
    if (name && template) {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSystemConfig(prev => ({
        ...prev,
        prompts: {
          ...prev.prompts,
          [id]: { name, template, active: true }
        }
      }));
    }
  };

  const toggleItem = (category, id) => {
    setSystemConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [id]: {
          ...prev[category][id],
          active: !prev[category][id].active
        }
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateContent = async () => {
    if (!formData.keyword || !formData.sourceUrl || !formData.affiliateLink || !formData.sourceMaterial || !formData.selectedPrompt || !formData.selectedPublication) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    // Build the complete prompt
    const selectedPromptTemplate = systemConfig.prompts[formData.selectedPrompt]?.template || '';
    const finalPrompt = selectedPromptTemplate.replace('[KEYWORD]', formData.keyword);
    
    const publicationName = systemConfig.publications[formData.selectedPublication]?.name || '';
    const siteName = formData.selectedSite ? systemConfig.ownSites[formData.selectedSite]?.name : '';

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Map to expected API fields
          keyword: formData.keyword,
          sourceMaterial: formData.sourceMaterial,
          sourceUrl: formData.sourceUrl,
          affiliateLink: formData.affiliateLink,
          companyName: 'Auto-Detected Company', // Required by API
          niche: 'general', // Required by API - will be auto-detected from source material
          modelTier: 'efficient',
          // Additional context for the AI
          prompt: finalPrompt,
          publication: publicationName,
          site: siteName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setCurrentStep('result');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate content');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addContentBlock = () => {
    const blockType = prompt('Content Block Type (e.g., "Testimonial", "FAQ", "Ingredients"):');
    const blockContent = prompt('Content for this block:');
    if (blockType && blockContent) {
      setContentBlocks(prev => [...prev, { type: blockType, content: blockContent, id: Date.now() }]);
    }
  };

  const removeContentBlock = (id) => {
    setContentBlocks(prev => prev.filter(block => block.id !== id));
  };

  const downloadHTML = () => {
    if (!result || !result.content) return;
    
    // Create WordPress-optimized HTML
    const wordpressHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.keyword} - Article</title>
    <!-- WordPress Compatible HTML - Ready for Copy/Paste -->
</head>
<body>
<!-- START WORDPRESS CONTENT - Copy everything below this line -->

${result.content.replace(/\n\n/g, '\n</p>\n\n<p>').replace(/^/, '<p>').replace(/$/, '</p>')}

<!-- Content Blocks -->
${contentBlocks.map(block => `
<div class="content-block ${block.type.toLowerCase().replace(/\s+/g, '-')}">
    <h3>${block.type}</h3>
    <p>${block.content}</p>
</div>
`).join('')}

<!-- Affiliate Link Integration -->
${formData.affiliateLink ? `
<div class="affiliate-cta" style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
    <p><strong>Ready to learn more?</strong></p>
    <a href="${formData.affiliateLink}" target="_blank" rel="noopener" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Get More Information →</a>
</div>
` : ''}

<!-- Source Attribution -->
${formData.sourceUrl ? `
<div class="source-attribution" style="font-size: 0.9em; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p><em>Source: <a href="${formData.sourceUrl}" target="_blank" rel="noopener">${formData.sourceUrl}</a></em></p>
</div>
` : ''}

<!-- END WORDPRESS CONTENT -->
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([wordpressHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.keyword.replace(/\s+/g, '-').toLowerCase()}-article.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadWordPressReady = () => {
    if (!result || !result.content) return;
    
    // Create clean WordPress-ready content (no HTML wrapper)
    const wordpressContent = `${result.content}

${contentBlocks.map(block => `
<div class="content-block">
<h3>${block.type}</h3>
<p>${block.content}</p>
</div>
`).join('')}

${formData.affiliateLink ? `
<div class="affiliate-cta" style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
<p><strong>Ready to learn more?</strong></p>
<a href="${formData.affiliateLink}" target="_blank" rel="noopener" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Get More Information →</a>
</div>
` : ''}

${formData.sourceUrl ? `
<div class="source-attribution" style="font-size: 0.9em; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p><em>Source: <a href="${formData.sourceUrl}" target="_blank" rel="noopener">${formData.sourceUrl}</a></em></p>
</div>
` : ''}`;

    const blob = new Blob([wordpressContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.keyword.replace(/\s+/g, '-').toLowerCase()}-wordpress-ready.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setCurrentStep('input');
    setFormData({
      keyword: '',
      sourceUrl: '',
      affiliateLink: '',
      sourceMaterial: '',
      selectedPrompt: '',
      selectedPublication: '',
      selectedSite: ''
    });
    setResult(null);
    setError(null);
    setContentBlocks([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Empire Intelligence System
        </h1>
        <p style={{ fontSize: '20px', opacity: '0.9', margin: '0 0 16px 0' }}>
          Streamlined Content Generation Platform
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
          <button
            onClick={() => setUserRole('team')}
            style={{
              background: userRole === 'team' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              color: userRole === 'team' ? '#4a5568' : 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Team View
          </button>
          <button
            onClick={() => setUserRole('admin')}
            style={{
              background: userRole === 'admin' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              color: userRole === 'admin' ? '#4a5568' : 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Admin View
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* ADMIN PANEL */}
        {userRole === 'admin' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
              🔧 Admin Configuration Panel
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* Publications Management */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
                  📰 Publications
                </h3>
                {Object.entries(systemConfig.publications).map(([id, pub]) => (
                  <div key={id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    padding: '8px',
                    background: pub.active ? '#c6f6d5' : '#fed7d7',
                    borderRadius: '6px'
                  }}>
                    <span>{pub.name}</span>
                    <button
                      onClick={() => toggleItem('publications', id)}
                      style={{
                        background: pub.active ? '#38a169' : '#e53e3e',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {pub.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPublication}
                  style={{
                    background: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  + Add Publication
                </button>
              </div>

              {/* Our Sites Management */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fff4, #c6f6d5)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #9ae6b4'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#22543d', marginBottom: '16px' }}>
                  🌐 Our Sites
                </h3>
                {Object.entries(systemConfig.ownSites).map(([id, site]) => (
                  <div key={id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    padding: '8px',
                    background: site.active ? '#f0fff4' : '#fed7d7',
                    borderRadius: '6px'
                  }}>
                    <span>{site.name}</span>
                    <button
                      onClick={() => toggleItem('ownSites', id)}
                      style={{
                        background: site.active ? '#38a169' : '#e53e3e',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {site.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOwnSite}
                  style={{
                    background: '#38a169',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  + Add Our Site
                </button>
              </div>

              {/* Prompts Management */}
              <div style={{
                background: 'linear-gradient(135deg, #fff5f5, #fed7e2)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #fbb6ce'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#702459', marginBottom: '16px' }}>
                  📝 Content Prompts
                </h3>
                {Object.entries(systemConfig.prompts).map(([id, prompt]) => (
                  <div key={id} style={{ 
                    marginBottom: '12px',
                    padding: '8px',
                    background: prompt.active ? '#fff5f5' : '#fed7d7',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{prompt.name}</strong>
                      <button
                        onClick={() => toggleItem('prompts', id)}
                        style={{
                          background: prompt.active ? '#38a169' : '#e53e3e',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {prompt.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                      {prompt.template.substring(0, 80)}...
                    </div>
                  </div>
                ))}
                <button
                  onClick={addPrompt}
                  style={{
                    background: '#d53f8c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  + Add Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEAM INPUT FORM */}
        {currentStep === 'input' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#2d3748', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              📝 Simple Content Creation
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#718096', 
              textAlign: 'center', 
              marginBottom: '32px' 
            }}>
              Fill in the 4 required fields, select your prompt and publication, then generate!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Core Required Fields */}
              <div style={{
                background: 'linear-gradient(135deg, #fff5f5, #fed7e2)',
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid #f687b3'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#702459', marginBottom: '20px' }}>
                  🎯 Required Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', color: '#702459', marginBottom: '8px' }}>
                      Keyword *
                    </label>
                    <input
                      type="text"
                      name="keyword"
                      value={formData.keyword}
                      onChange={handleInputChange}
                      placeholder="Main keyword to focus on"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #f687b3',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', color: '#702459', marginBottom: '8px' }}>
                      Source URL *
                    </label>
                    <input
                      type="url"
                      name="sourceUrl"
                      value={formData.sourceUrl}
                      onChange={handleInputChange}
                      placeholder="https://source-website.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #f687b3',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#702459', marginBottom: '8px' }}>
                    Affiliate Link *
                  </label>
                  <input
                    type="url"
                    name="affiliateLink"
                    value={formData.affiliateLink}
                    onChange={handleInputChange}
                    placeholder="https://affiliate-tracking-link.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #f687b3',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#702459', marginBottom: '8px' }}>
                    Source Material *
                  </label>
                  <textarea
                    name="sourceMaterial"
                    value={formData.sourceMaterial}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Paste your source material, product information, research, or any content to base the article on..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #f687b3',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Prompt Selection */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#4a5568', marginBottom: '8px', fontSize: '18px' }}>
                  📋 Select Content Type *
                </label>
                <select
                  name="selectedPrompt"
                  value={formData.selectedPrompt}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Choose content type...</option>
                  {Object.entries(systemConfig.prompts)
                    .filter(([_, prompt]) => prompt.active)
                    .map(([id, prompt]) => (
                    <option key={id} value={id}>{prompt.name}</option>
                  ))}
                </select>
              </div>

              {/* Publication Selection */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#4a5568', marginBottom: '8px', fontSize: '18px' }}>
                  📰 Where to Publish *
                </label>
                <select
                  name="selectedPublication"
                  value={formData.selectedPublication}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Choose publication...</option>
                  {Object.entries(systemConfig.publications)
                    .filter(([_, pub]) => pub.active)
                    .map(([id, pub]) => (
                    <option key={id} value={id}>{pub.name}</option>
                  ))}
                </select>
              </div>

              {/* Site Selection (if "Our Sites" selected) */}
              {formData.selectedPublication === 'our-sites' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#4a5568', marginBottom: '8px', fontSize: '18px' }}>
                    🌐 Which Site *
                  </label>
                  <select
                    name="selectedSite"
                    value={formData.selectedSite}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Choose site...</option>
                    {Object.entries(systemConfig.ownSites)
                      .filter(([_, site]) => site.active)
                      .map(([id, site]) => (
                      <option key={id} value={id}>{site.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Content Blocks */}
              {contentBlocks.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fff4, #c6f6d5)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #9ae6b4'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#22543d', marginBottom: '12px' }}>
                    🧩 Additional Content Blocks
                  </h4>
                  {contentBlocks.map((block) => (
                    <div key={block.id} style={{
                      background: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong>{block.type}:</strong>
                        <span style={{ marginLeft: '8px', color: '#4a5568' }}>
                          {block.content.substring(0, 50)}...
                        </span>
                      </div>
                      <button
                        onClick={() => removeContentBlock(block.id)}
                        style={{
                          background: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addContentBlock}
                style={{
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                + Add Content Block
              </button>

              {error && (
                <div style={{
                  background: 'linear-gradient(135deg, #fed7d7, #feb2b2)',
                  border: '2px solid #f56565',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#c53030',
                  fontWeight: 'bold'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={generateContent}
                disabled={isGenerating || !formData.keyword || !formData.sourceUrl || !formData.affiliateLink || !formData.sourceMaterial || !formData.selectedPrompt || !formData.selectedPublication}
                style={{
                  background: isGenerating || !formData.keyword || !formData.sourceUrl || !formData.affiliateLink || !formData.sourceMaterial || !formData.selectedPrompt || !formData.selectedPublication
                    ? 'linear-gradient(135deg, #a0aec0, #718096)' 
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '20px 40px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: isGenerating || !formData.keyword || !formData.sourceUrl || !formData.affiliateLink || !formData.sourceMaterial || !formData.selectedPrompt || !formData.selectedPublication ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  width: '100%'
                }}
              >
                {isGenerating ? '⚡ Generating Content...' : '🚀 Generate Content'}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS DISPLAY */}
        {currentStep === 'result' && result && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748', marginBottom: '32px' }}>
              🎉 Content Generated Successfully
            </h2>
            
            {/* Quality Metrics */}
            <div style={{
              background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#718096' }}>Word Count:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748' }}>
                    {result.qualityBreakdown?.wordCount || 'N/A'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#718096' }}>Quality Score:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748' }}>
                    {result.qualityScore}/100
                  </span>
                </div>
                <div>
                  <span style={{ color: '#718096' }}>Cost:</span>
                  <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748' }}>
                    ${result.estimatedCost}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Content */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
                  Generated Content
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.content)}
                    style={{
                      background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📋 Copy Text
                  </button>
                  <button
                    onClick={downloadHTML}
                    style={{
                      background: 'linear-gradient(135deg, #48bb78, #38a169)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📄 Download HTML
                  </button>
                  <button
                    onClick={downloadWordPressReady}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🌐 WordPress Ready
                  </button>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                padding: '24px',
                borderRadius: '12px',
                maxHeight: '600px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0'
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  color: '#2d3748',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {result.content}
                </pre>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={resetAll}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔄 Create New Content
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpireIntelligenceSystem;
