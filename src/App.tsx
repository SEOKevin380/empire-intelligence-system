import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Zap, Target, Download, Settings, CheckCircle, AlertCircle, Loader2, TrendingUp, Award, Eye, RefreshCw, Code, Copy } from 'lucide-react';

export default function WorkingHTMLCopySystem() {
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
  const [viewMode, setViewMode] = useState('formatted');
  const [copySuccess, setCopySuccess] = useState('');

  // Real-time analysis
  const performRealTimeAnalysis = useCallback(async (currentFormData) => {
    if (!currentFormData.keyword || currentFormData.keyword.length < 2) {
      setRealTimeAnalysis({});
      return;
    }

    try {
      const analysis = {
        keywordStrength: calculateKeywordStrength(currentFormData.keyword),
        publicationAlignment: calculatePublicationAlignment(currentFormData.publication, currentFormData.keyword),
        wordCountOptimization: calculateWordCountOptimization(currentFormData.wordCount),
        sourceQuality: calculateSourceQuality(currentFormData.sourceMaterial),
        overallInputScore: 0
      };

      analysis.overallInputScore = Math.round(
        (analysis.keywordStrength + analysis.publicationAlignment + analysis.wordCountOptimization + analysis.sourceQuality) / 4
      );

      setRealTimeAnalysis(analysis);

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

  // Professional generation with complete formatting
  const handleProfessionalGeneration = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    setHtmlContent('');
    setQualityMetrics(null);
    setAutonomousOptimizations([]);
    setCopySuccess('');

    try {
      console.log('🎯 INITIATING COMPLETE PROFESSIONAL FORMATTING...');
      
      const enhancedPayload = {
        publication: formData.publication?.trim() || 'Default Publication',
        keyword: formData.keyword?.trim(),
        wordCount: parseInt(formData.wordCount) || 8000,
        affiliateLink: formData.affiliateLink?.trim() || '',
        sourceUrl: formData.sourceUrl?.trim() || '',
        sourceMaterial: formData.sourceMaterial?.trim() || '',
        company: formData.company?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || ''
      };

      // Processing stages
      setProcessingStage('📝 Creating professional article title...');
      setTimeout(() => setProcessingStage('📋 Generating structured introduction...'), 2000);
      setTimeout(() => setProcessingStage('✍️ Writing main content sections...'), 5000);
      setTimeout(() => setProcessingStage('🔧 Converting to HTML format...'), 10000);
      setTimeout(() => setProcessingStage('📈 Calculating quality metrics...'), 13000);

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
      console.log('✅ COMPLETE PROFESSIONAL FORMATTING SUCCESS:', result);

      if (result.success && result.article?.content) {
        setGeneratedContent(result.article.content);
        setHtmlContent(result.article.htmlContent || '');
        setQualityMetrics(result.article.qualityScore || result.metadata?.qualityMetrics);
        setAutonomousOptimizations(result.article.optimizations || []);
        setAiRecommendations(result.article.aiRecommendations || []);
        
        console.log(`🎊 SUCCESS: Professional article with title and formatting complete!`);
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

  // Working HTML copy function
  const copyHTMLToClipboard = async () => {
    if (!htmlContent) {
      setCopySuccess('❌ No HTML content to copy');
      return;
    }
    
    try {
      // Method 1: Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(htmlContent);
        setCopySuccess('✅ HTML copied to clipboard!');
        console.log('HTML copied successfully via Clipboard API');
      } else {
        // Method 2: Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = htmlContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopySuccess('✅ HTML copied to clipboard!');
          console.log('HTML copied successfully via fallback method');
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      setCopySuccess('❌ Copy failed - please try download instead');
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => setCopySuccess(''), 3000);
  };

  // Download functionality with multiple formats
  const downloadContent = (format) => {
    if (!generatedContent && !htmlContent) return;
    
    let downloadContent = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (format) {
      case 'html':
        downloadContent = htmlContent || convertMarkdownToHTML(generatedContent);
        filename = `${formData.keyword.replace(/\s+/g, '-')}-formatted.html`;
        mimeType = 'text/html';
        break;
      case 'markdown':
        downloadContent = generatedContent;
        filename = `${formData.keyword.replace(/\s+/g, '-')}-content.md`;
        mimeType = 'text/markdown';
        break;
      case 'txt':
        downloadContent = generatedContent.replace(/[#*]/g, '');
        filename = `${formData.keyword.replace(/\s+/g, '-')}-content.txt`;
        mimeType = 'text/plain';
        break;
      case 'with-report':
        downloadContent = generatedContent + '\n\n--- PROFESSIONAL QUALITY REPORT ---\n';
        downloadContent += `Overall Quality Score: ${qualityMetrics?.overallScore || qualityMetrics}%\n`;
        downloadContent += `Word Count: ${estimateWordCount(generatedContent)} words\n`;
        downloadContent += `Applied Optimizations:\n${autonomousOptimizations.map(opt => `- ${opt}`).join('\n')}`;
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

  // Simple markdown to HTML converter for fallback
  const convertMarkdownToHTML = (markdown) => {
    return markdown
      .replace(/^# (.*$)/gm, '<h1><strong>$1</strong></h1>')
      .replace(/^## \*\*(.*?)\*\*$/gm, '<h2><strong>$1</strong></h2>')
      .replace(/^### \*\*(.*?)\*\*$/gm, '<h3><strong>$1</strong></h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^• (.*)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
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
        {/* Header */}
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
              Complete Professional Formatting System
            </h1>
            <Award size={32} style={{ color: '#764ba2' }} />
          </div>
          <p style={{ fontSize: '1.3rem', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
            Professional Articles with Title + HTML Copy + Compliance Ready
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px', color: '#9ca3af' }}>
            <span>📝 Professional Title</span>
            <span>📋 SEO Structure</span>
            <span>🔧 HTML Copy</span>
            <span>⚖️ Full Compliance</span>
          </div>
        </div>

        {/* Real-Time Analysis Dashboard */}
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
              Real-Time Professional Analysis
              <span style={{
                marginLeft: 'auto',
                fontSize: '1.4rem',
                color: realTimeAnalysis.overallInputScore >= 80 ? '#10b981' : realTimeAnalysis.overallInputScore >= 60 ? '#f59e0b' : '#ef4444'
              }}>
                {realTimeAnalysis.overallInputScore}% Ready
              </span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🎯</div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Keyword</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.keywordStrength}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📈</div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Publication</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.publicationAlignment}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📝</div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Word Count</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.wordCountOptimization}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📚</div>
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Source</div>
                <div style={{ color: '#6b7280' }}>{realTimeAnalysis.sourceQuality}%</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Left Column - Input Fields */}
          <div>
            {/* Strategic Content */}
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
                    border: '2px solid #e5e7eb',
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
                    border: '2px solid #e5e7eb',
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
                  <option value="8000">8,000 words (Professional Standard)</option>
                  <option value="6000">6,000 words</option>
                  <option value="4000">4,000 words</option>
                  <option value="10000">10,000 words</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  Affiliate Link (Auto-Compliance)
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

            {/* Source Material */}
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
                placeholder="Add research, facts, studies, or specific requirements for enhanced accuracy..."
              />
            </div>

            {/* Contact Information */}
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#047857', fontSize: '1.1rem', fontWeight: 'bold' }}>
                Contact Information
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#059669', marginLeft: '8px' }}>
                  (Email or Phone Required)
                </span>
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                  placeholder="Your Company Name"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: `2px solid ${(!formData.email && !formData.phone) ? '#ef4444' : '#e5e7eb'}`, 
                    borderRadius: '8px' 
                  }}
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: `2px solid ${(!formData.email && !formData.phone) ? '#ef4444' : '#e5e7eb'}`, 
                    borderRadius: '8px' 
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>

              {!formData.email && !formData.phone && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#ef4444', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle size={14} />
                  Please provide either email or phone number
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Generation & Results */}
          <div>
            {/* Professional Generation Button */}
            <button
              onClick={handleProfessionalGeneration}
              disabled={isLoading || !formData.publication || !formData.keyword || (!formData.email && !formData.phone)}
              style={{
                width: '100%',
                padding: '24px',
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                  : (!formData.publication || !formData.keyword || (!formData.email && !formData.phone))
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: (isLoading || !formData.publication || !formData.keyword || (!formData.email && !formData.phone)) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '32px',
                boxShadow: (isLoading || !formData.publication || !formData.keyword || (!formData.email && !formData.phone)) ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>Professional System Active</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>{processingStage}</div>
                  </div>
                </>
              ) : (
                <>
                  <Code size={24} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>Generate Professional Article</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>Complete with Title + HTML + Compliance</div>
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
                  <strong>System Error:</strong>
                </div>
                <p style={{ margin: '0', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            {/* Quality Results & Actions */}
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
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Professional Article Complete</div>
                    <div style={{ fontSize: '14px', opacity: '0.8' }}>Ready for Publication with Full Compliance</div>
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

                {/* Copy Success Message */}
                {copySuccess && (
                  <div style={{
                    padding: '12px',
                    background: copySuccess.includes('✅') ? '#d1fae5' : '#fef2f2',
                    border: `1px solid ${copySuccess.includes('✅') ? '#10b981' : '#ef4444'}`,
                    borderRadius: '8px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: copySuccess.includes('✅') ? '#047857' : '#dc2626'
                  }}>
                    {copySuccess}
                  </div>
                )}

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
                      Article View
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
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={copyHTMLToClipboard}
                    style={{
                      padding: '10px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Copy size={16} />
                    Copy HTML
                  </button>
                  
                  <button
                    onClick={() => downloadContent('html')}
                    style={{
                      padding: '10px 16px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <Download size={16} />
                    Download HTML
                  </button>

                  <button
                    onClick={() => downloadContent('markdown')}
                    style={{
                      padding: '10px 16px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <Download size={16} />
                    Markdown
                  </button>

                  <button
                    onClick={() => downloadContent('with-report')}
                    style={{
                      padding: '10px 16px',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <TrendingUp size={16} />
                    With Report
                  </button>
                </div>
              </div>
            )}

            {/* Content Preview */}
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
                  Professional Article Preview
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

                {/* Content Display */}
                {viewMode === 'formatted' && (
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: '#374151'
                  }}>
                    {htmlContent ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: htmlContent.substring(0, 3000) + (htmlContent.length > 3000 ? '<p><em>... (preview truncated)</em></p>' : '') 
                      }} />
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {generatedContent.substring(0, 2000)}
                        {generatedContent.length > 2000 && <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>... (preview truncated)</span>}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'html' && (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Functions
function calculateKeywordStrength(keyword) {
  if (!keyword) return 0;
  let score = 50;
  if (keyword.length >= 3) score += 20;
  if (keyword.includes(' ')) score += 15;
  if (/\b(benefits|guide|how to|best|complete)\b/i.test(keyword)) score += 15;
  return Math.min(100, score);
}

function calculatePublicationAlignment(publication, keyword) {
  if (!publication || !keyword) return 0;
  let score = 60;
  
  if (publication.includes('Health') && /\b(health|supplement|wellness|benefit)\b/i.test(keyword)) score += 40;
  if (publication.includes('Tech') && /\b(software|technology|digital|tech)\b/i.test(keyword)) score += 40;
  if (publication.includes('Finance') && /\b(investment|money|financial|crypto)\b/i.test(keyword)) score += 40;
  if (publication.includes('wire')) score += 20;
  
  return Math.min(100, score);
}

function calculateWordCountOptimization(wordCount) {
  const count = parseInt(wordCount) || 0;
  if (count >= 8000) return 100;
  if (count >= 6000) return 85;
  if (count >= 4000) return 70;
  return 50;
}

function calculateSourceQuality(sourceMaterial) {
  if (!sourceMaterial) return 30;
  let score = 40;
  if (sourceMaterial.length >= 100) score += 30;
  if (sourceMaterial.length >= 300) score += 20;
  if (/\b(study|research|data|evidence)\b/i.test(sourceMaterial)) score += 10;
  return Math.min(100, score);
}

function estimateWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
