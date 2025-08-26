import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Zap, Target, Download, Settings, CheckCircle, AlertCircle, Loader2, TrendingUp, Award, Eye, RefreshCw, Code } from 'lucide-react';

export default function ProfessionalFormattingSystem() {
  const [formData, setFormData] = useState({
    publication: '',
    keyword: '',
    wordCount: '8000',
    affiliateLink: '',
    sourceUrl: '',
    sourceMaterial: '',
    company: '',
    email: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [processingStage, setProcessingStage] = useState('');
  const [autonomousOptimizations, setAutonomousOptimizations] = useState([]);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState({});
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted', 'html', 'markdown'

  // Real-time analysis function
  const performRealTimeAnalysis = useCallback(async (currentFormData) => {
    if (!currentFormData.keyword || currentFormData.keyword.length < 2) {
      setRealTimeAnalysis({});
      return;
    }

    try {
      const analysis = {
        keywordStrength: calculateKeywordStrength(currentFormData.keyword),
        publicationAlignment: calculatePublicationAlignment(currentFormData.publication, currentFormData.keyword),
        wordCountOptimization: calculateWordCountOptimization(currentFormData.wordCount, currentFormData.keyword),
        sourceQuality: calculateSourceQuality(currentFormData.sourceMaterial),
        overallInputScore: 0
      };

      analysis.overallInputScore = Math.round(
        (analysis.keywordStrength + analysis.publicationAlignment + analysis.wordCountOptimization + analysis.sourceQuality) / 4
      );

      setRealTimeAnalysis(analysis);

      const recommendations = generateAIRecommendations(analysis, currentFormData);
      setAiRecommendations(recommendations);

    } catch (error) {
      console.error('Real-time analysis error:', error);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performRealTimeAnalysis(formData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, performRealTimeAnalysis]);

  // Enhanced generation with professional formatting
  const handleProfessionalGeneration = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    setHtmlContent('');
    setQualityMetrics(null);
    setAutonomousOptimizations([]);

    try {
      console.log('🎯 INITIATING PROFESSIONAL FORMATTING SYSTEM...');
      
      const enhancedPayload = {
        publication: formData.publication?.trim() || 'Default Publication',
        keyword: formData.keyword?.trim(),
        wordCount: parseInt(formData.wordCount) || 8000,
        affiliateLink: formData.affiliateLink?.trim() || '',
        sourceUrl: formData.sourceUrl?.trim() || '',
        sourceMaterial: formData.sourceMaterial?.trim() || '',
        company: formData.company?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        enableProfessionalFormatting: true,
        enableHTMLExtraction: true,
        realTimeAnalysis: realTimeAnalysis
      };

      // Stage updates
      setProcessingStage('📋 Creating aggressive SEO-minded outline...');
      setTimeout(() => setProcessingStage('✍️ Generating professional content with compliance...'), 3000);
      setTimeout(() => setProcessingStage('🔧 Converting to HTML with formatting...'), 8000);
      setTimeout(() => setProcessingStage('📈 Calculating quality metrics...'), 12000);

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Generation Error:', errorData);
        throw new Error(errorData.details || errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ PROFESSIONAL FORMATTING COMPLETE:', result);

      if (result.success && result.article?.content) {
        setGeneratedContent(result.article.content);
        setHtmlContent(result.article.htmlContent || '');
        setQualityMetrics(result.article.qualityScore || result.metadata?.qualityMetrics);
        setAutonomousOptimizations(result.article.optimizations || []);
        setAiRecommendations(result.article.aiRecommendations || []);
        
        console.log(`🎊 SUCCESS: ${result.article.wordCount} words with professional formatting!`);
      } else {
        throw new Error('Professional generation completed but no content received');
      }

    } catch (err) {
      console.error('🚨 Professional Generation Error:', err);
      setError(err.message || 'Professional content generation failed');
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  // Copy HTML to clipboard
  const copyHtmlToClipboard = async () => {
    if (!htmlContent) return;
    
    try {
      await navigator.clipboard.writeText(htmlContent);
      alert('HTML content copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy HTML:', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = htmlContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('HTML content copied to clipboard!');
    }
  };

  // Download functionality with multiple formats
  const downloadContent = (format) => {
    if (!generatedContent) return;
    
    let downloadContent = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (format) {
      case 'html':
        downloadContent = htmlContent || generatedContent;
        filename = `${formData.keyword.replace(/\s+/g, '-')}-formatted.html`;
        mimeType = 'text/html';
        break;
      case 'markdown':
        downloadContent = generatedContent;
        filename = `${formData.keyword.replace(/\s+/g, '-')}-markdown.md`;
        mimeType = 'text/markdown';
        break;
      case 'with-report':
        downloadContent = generatedContent + '\n\n--- PROFESSIONAL QUALITY REPORT ---\n';
        downloadContent += `Overall Quality Score: ${qualityMetrics?.overallScore || qualityMetrics}%\n`;
        downloadContent += `Word Count Accuracy: ${qualityMetrics?.wordCountAccuracy || 'N/A'}%\n`;
        downloadContent += `SEO Optimization: ${qualityMetrics?.seoOptimization || 'N/A'}%\n`;
        downloadContent += `Compliance Score: ${qualityMetrics?.complianceScore || 'N/A'}%\n`;
        downloadContent += `\nApplied Optimizations:\n${autonomousOptimizations.map(opt => `- ${opt}`).join('\n')}`;
        downloadContent += `\nAI Recommendations:\n${aiRecommendations.map(rec => `- ${rec}`).join('\n')}`;
        filename = `${formData.keyword.replace(/\s+/g, '-')}-with-report.txt`;
        break;
      default:
        downloadContent = generatedContent;
        filename = `${formData.keyword.replace(/\s+/g, '-')}-content.txt`;
    }
    
    const blob = new Blob([downloadContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
      }}>
        {/* Enhanced Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Code size={32} style={{ color: '#667eea' }} />
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Professional Formatting & HTML Extraction System
            </h1>
            <Award size={32} style={{ color: '#764ba2' }} />
          </div>
          <p style={{ fontSize: '1.3rem', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
            SEO-Optimized Content with Professional Formatting & Compliance
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px', color: '#9ca3af' }}>
            <span>📋 SEO Expert Outline</span>
            <span>✍️ Professional Formatting</span>
            <span>🔧 HTML Extraction</span>
            <span>⚖️ Compliance Ready</span>
          </div>
        </div>

        {/* Real-Time Analysis Dashboard (kept from previous version) */}
        {realTimeAnalysis.overallInputScore > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f3e8ff, #e0e7ff)',
            border: '2px solid #8b5cf6',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: '#6b46c1',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Eye size={20} style={{ marginRight: '8px' }} />
              Real-Time SEO Analysis Dashboard
              <span style={{
                marginLeft: 'auto',
                fontSize: '1.4rem',
                color: realTimeAnalysis.overallInputScore >= 80 ? '#10b981' : realTimeAnalysis.overallInputScore >= 60 ? '#f59e0b' : '#ef4444'
              }}>
                {realTimeAnalysis.overallInputScore}% Quality Score
              </span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                  {realTimeAnalysis.keywordStrength >= 80 ? '🎯' : realTimeAnalysis.keywordStrength >= 60 ? '🔸' : '🔹'}
                </div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>SEO Strength</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.keywordStrength}%</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                  {realTimeAnalysis.publicationAlignment >= 80 ? '📈' : realTimeAnalysis.publicationAlignment >= 60 ? '📊' : '📉'}
                </div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Publication Match</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.publicationAlignment}%</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                  {realTimeAnalysis.wordCountOptimization >= 80 ? '📝' : realTimeAnalysis.wordCountOptimization >= 60 ? '📄' : '📋'}
                </div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Word Count</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.wordCountOptimization}%</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
                  {realTimeAnalysis.sourceQuality >= 80 ? '🔬' : realTimeAnalysis.sourceQuality >= 60 ? '📚' : '📖'}
                </div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Source Quality</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.sourceQuality}%</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Left Column - Input Fields (same as before but simplified) */}
          <div>
            {/* Strategic Content Section */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#92400e',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Target size={20} style={{ marginRight: '8px' }} />
                Strategic Content Architecture
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  Publication Target *
                </label>
                <select
                  value={formData.publication}
                  onChange={(e) => setFormData(prev => ({ ...prev, publication: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${realTimeAnalysis.publicationAlignment >= 80 ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Publication</option>
                  <option value="Globe Newswire">Globe Newswire</option>
                  <option value="Newswire">Newswire</option>
                  <option value="Our Health Site">Our Health Site</option>
                  <option value="Our Tech Site">Our Tech Site</option>
                  <option value="Our Finance Site">Our Finance Site</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  Primary Keyword *
                </label>
                <input
                  type="text"
                  value={formData.keyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${realTimeAnalysis.keywordStrength >= 80 ? '#10b981' : realTimeAnalysis.keywordStrength >= 60 ? '#f59e0b' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="mushroom gummies benefits"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  Target Word Count *
                </label>
                <select
                  value={formData.wordCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, wordCount: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="8000">8,000 words (SEO Recommended)</option>
                  <option value="6000">6,000 words</option>
                  <option value="4000">4,000 words</option>
                  <option value="10000">10,000 words</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  Affiliate Link (Auto-Integration with Compliance)
                </label>
                <input
                  type="url"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, affiliateLink: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="https://affiliate-link.com"
                />
              </div>
            </div>

            {/* Source Material Section (simplified) */}
            <div style={{
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
              border: '2px solid #6366f1',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#4338ca',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                Source Material (Professional Accuracy)
              </h3>

              <textarea
                value={formData.sourceMaterial}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceMaterial: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '120px',
                  resize: 'vertical'
                }}
                placeholder="Paste research, facts, studies, or requirements for professional accuracy..."
              />
            </div>

            {/* Contact Information (simplified) */}
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#047857', fontSize: '1.1rem', fontWeight: 'bold' }}>
                Contact Information
              </h3>
              
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }}
                placeholder="Company Name"
              />
              
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          {/* Right Column - Generation & Results */}
          <div>
            {/* Professional Generation Button */}
            <button
              onClick={handleProfessionalGeneration}
              disabled={isLoading || !formData.publication || !formData.keyword}
              style={{
                width: '100%',
                padding: '24px',
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                  : 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '32px',
                boxShadow: isLoading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>Professional Formatting Active</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>{processingStage}</div>
                  </div>
                </>
              ) : (
                <>
                  <Code size={24} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>Generate Professional Content</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>SEO + HTML + Compliance Ready</div>
                  </div>
                  <Zap size={24} />
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', marginBottom: '8px' }}>
                  <AlertCircle size={20} />
                  <strong>Professional System Error:</strong>
                </div>
                <p style={{ margin: '0', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            {/* Quality Metrics & Download Section */}
            {qualityMetrics && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '2px solid #10b981',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '16px' }}>
                  <Award size={24} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Professional Quality Achievement</div>
                    <div style={{ fontSize: '14px', opacity: '0.8' }}>SEO + Formatting + Compliance Verified</div>
                  </div>
                  <div style={{
                    marginLeft: 'auto',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: qualityMetrics.overallScore >= 90 ? '#10b981' : qualityMetrics.overallScore >= 80 ? '#f59e0b' : '#ef4444'
                  }}>
                    {qualityMetrics.overallScore || qualityMetrics}%
                  </div>
                </div>

                {/* View Mode Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      onClick={() => setViewMode('formatted')}
                      style={{
                        padding: '8px 16px',
                        background: viewMode === 'formatted' ? '#10b981' : '#e5e7eb',
                        color: viewMode === 'formatted' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Formatted View
                    </button>
                    <button
                      onClick={() => setViewMode('html')}
                      style={{
                        padding: '8px 16px',
                        background: viewMode === 'html' ? '#6366f1' : '#e5e7eb',
                        color: viewMode === 'html' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      HTML Source
                    </button>
                    <button
                      onClick={() => setViewMode('markdown')}
                      style={{
                        padding: '8px 16px',
                        background: viewMode === 'markdown' ? '#f59e0b' : '#e5e7eb',
                        color: viewMode === 'markdown' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Markdown
                    </button>
                  </div>
                </div>

                {/* Download & Copy Options */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => downloadContent('html')}
                    style={{
                      padding: '8px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <Download size={14} />
                    HTML
                  </button>
                  
                  <button
                    onClick={() => downloadContent('markdown')}
                    style={{
                      padding: '8px 12px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <Download size={14} />
                    Markdown
                  </button>

                  <button
                    onClick={copyHtmlToClipboard}
                    style={{
                      padding: '8px 12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <Code size={14} />
                    Copy HTML
                  </button>

                  <button
                    onClick={() => downloadContent('with-report')}
                    style={{
                      padding: '8px 12px',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <TrendingUp size={14} />
                    Report
                  </button>
                </div>
              </div>
            )}

            {/* Content Preview with Multiple Views */}
            {generatedContent && (
              <div style={{
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <h4 style={{ margin: '0 0 16px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} />
                  Professional Content Preview
                  {qualityMetrics && (
                    <span style={{
                      marginLeft: 'auto',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: qualityMetrics.overallScore >= 90 ? '#10b981' : '#f59e0b',
                      color: 'white'
                    }}>
                      {qualityMetrics.overallScore || qualityMetrics}% Quality
                    </span>
                  )}
                </h4>

                {/* Content Display Based on View Mode */}
                {viewMode === 'formatted' && htmlContent && (
                  <div 
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.7',
                      color: '#374151'
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlContent.substring(0, 3000) + (htmlContent.length > 3000 ? '...' : '') }}
                  />
                )}

                {viewMode === 'html' && htmlContent && (
                  <pre style={{
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#4b5563',
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
                  }}>
                    {htmlContent.substring(0, 2000)}
                    {htmlContent.length > 2000 && <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>... (HTML truncated for display)</span>}
                  </pre>
                )}

                {viewMode === 'markdown' && (
                  <pre style={{
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#4b5563',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
                  }}>
                    {generatedContent.substring(0, 2000)}
                    {generatedContent.length > 2000 && <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>... (Content truncated for display)</span>}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Functions (same as before)
function calculateKeywordStrength(keyword) {
  if (!keyword) return 0;
  let score = 50;
  if (keyword.length >= 3) score += 20;
  if (keyword.includes(' ')) score += 15;
  if (/\b(benefits|review|guide|how to|best|top)\b/i.test(keyword)) score += 15;
  return Math.min(100, score);
}

function calculatePublicationAlignment(publication, keyword) {
  if (!publication || !keyword) return 0;
  let score = 60;
  
  if (publication.includes('Health') && /\b(health|supplement|nutrition|wellness|medical)\b/i.test(keyword)) score += 40;
  if (publication.includes('Tech') && /\b(software|technology|ai|digital|app)\b/i.test(keyword)) score += 40;
  if (publication.includes('Finance') && /\b(investment|money|financial|crypto|trading)\b/i.test(keyword)) score += 40;
  if (publication.includes('wire')) score += 20;
  
  return Math.min(100, score);
}

function calculateWordCountOptimization(wordCount, keyword) {
  const count = parseInt(wordCount) || 0;
  if (count >= 8000) return 100;
  if (count >= 6000) return 85;
  if (count >= 4000) return 70;
  if (count >= 2000) return 55;
  return 40;
}

function calculateSourceQuality(sourceMaterial) {
  if (!sourceMaterial) return 30;
  let score = 40;
  if (sourceMaterial.length >= 100) score += 20;
  if (sourceMaterial.length >= 300) score += 20;
  if (sourceMaterial.includes('http')) score += 10;
  if (/\b(study|research|report|data|statistics)\b/i.test(sourceMaterial)) score += 10;
  return Math.min(100, score);
}

function generateAIRecommendations(analysis, formData) {
  const recommendations = [];
  
  if (analysis.keywordStrength < 80) {
    recommendations.push('Consider adding modifying words like "benefits", "guide", or "review" to strengthen your keyword');
  }
  
  if (analysis.publicationAlignment < 80) {
    recommendations.push('Your keyword doesn\'t strongly align with the selected publication - consider switching publications or adjusting your keyword');
  }
  
  if (analysis.wordCountOptimization < 90) {
    recommendations.push('For maximum SEO impact, consider increasing word count to 8,000+ words');
  }
  
  if (analysis.sourceQuality < 70) {
    recommendations.push('Add more source material with studies, statistics, or research data to improve content accuracy and authority');
  }
  
  return recommendations;
}
