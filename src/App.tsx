import React, { useState } from 'react';

const EmpireIntelligenceSystem = () => {
  const [formData, setFormData] = useState({
    niche: '',
    keyword: '',
    sourceMaterial: '',
    companyName: '',
    modelTier: 'efficient'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateContent = async () => {
    if (!formData.niche || !formData.keyword || !formData.companyName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setFormData({
      niche: '',
      keyword: '',
      sourceMaterial: '',
      companyName: '',
      modelTier: 'efficient'
    });
    setResult(null);
    setError(null);
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
          Advanced AI-Powered SEO Content Generation Platform
        </p>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          Version 17.0 - Production Ready
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Input Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748', marginBottom: '32px' }}>
              Content Generation
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: '#4a5568', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: '#4a5568', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  Niche/Industry *
                </label>
                <input
                  type="text"
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  placeholder="e.g., health-supplements, technology, finance"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: '#4a5568', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  Target Keyword *
                </label>
                <input
                  type="text"
                  name="keyword"
                  value={formData.keyword}
                  onChange={handleInputChange}
                  placeholder="Main keyword to target"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: '#4a5568', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  Source Material (Optional)
                </label>
                <textarea
                  name="sourceMaterial"
                  value={formData.sourceMaterial}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Additional context or source material to base the content on"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  color: '#4a5568', 
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  Model Tier
                </label>
                <select
                  name="modelTier"
                  value={formData.modelTier}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                >
                  <option value="efficient">Efficient (Recommended)</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

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

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={generateContent}
                  disabled={isGenerating}
                  style={{
                    flex: '1',
                    background: isGenerating 
                      ? 'linear-gradient(135deg, #a0aec0, #718096)' 
                      : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '18px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: isGenerating ? 0.7 : 1
                  }}
                >
                  {isGenerating ? '⚡ Generating Content...' : '🚀 Generate SEO Content'}
                </button>
                
                <button
                  onClick={resetForm}
                  style={{
                    padding: '18px 24px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#4a5568',
                    borderRadius: '12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748', marginBottom: '32px' }}>
              Generated Content
            </h2>
            
            {!result && !isGenerating && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#a0aec0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                <p style={{ fontSize: '18px' }}>Fill in the form and click "Generate SEO Content" to begin</p>
              </div>
            )}

            {isGenerating && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>⚡</div>
                <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '24px' }}>
                  Generating professional SEO content...
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '60%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '4px',
                    animation: 'pulse 1s infinite'
                  }}></div>
                </div>
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Quality Metrics */}
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '16px' 
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
                      Content Quality
                    </h3>
                    <span style={{
                      background: 'linear-gradient(135deg, #48bb78, #38a169)',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      Score: {result.qualityScore}/100
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                    <div>
                      <span style={{ color: '#718096' }}>Word Count:</span>
                      <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748' }}>
                        {result.qualityBreakdown?.wordCount || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#718096' }}>H2 Sections:</span>
                      <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748' }}>
                        {result.qualityBreakdown?.h2Sections || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#718096' }}>Model Used:</span>
                      <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#2d3748', fontSize: '12px' }}>
                        {result.modelUsed}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#718096' }}>Est. Cost:</span>
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
                    marginBottom: '16px' 
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
                      Generated Article
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.content)}
                      style={{
                        background: 'linear-gradient(135deg, #edf2f7, #e2e8f0)',
                        color: '#4a5568',
                        border: '1px solid #cbd5e0',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
                    padding: '24px',
                    borderRadius: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0'
                  }}>
                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px',
                      color: '#2d3748',
                      fontFamily: 'monospace',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {result.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {result && (
          <div style={{ 
            marginTop: '40px', 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            Content generated successfully • Quality Score: {result.qualityScore}/100 • 
            {result.qualityBreakdown?.wordCount} words • Cost: ${result.estimatedCost}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpireIntelligenceSystem;
