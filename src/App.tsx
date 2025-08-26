import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Zap, Target, Download, Settings, CheckCircle, AlertCircle, Loader2, TrendingUp, Award, Eye, RefreshCw } from 'lucide-react';

export default function AutonomousQualityIntelligenceSystem() {
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
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [processingStage, setProcessingStage] = useState('');
  const [autonomousOptimizations, setAutonomousOptimizations] = useState([]);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState({});

  // 🧠 AUTONOMOUS REAL-TIME INPUT ANALYSIS
  const performRealTimeAnalysis = useCallback(async (currentFormData) => {
    if (!currentFormData.keyword || currentFormData.keyword.length < 2) {
      setRealTimeAnalysis({});
      return;
    }

    try {
      // Simulate AI analysis of input quality
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

      // Generate AI recommendations based on analysis
      const recommendations = generateAIRecommendations(analysis, currentFormData);
      setAiRecommendations(recommendations);

    } catch (error) {
      console.error('Real-time analysis error:', error);
    }
  }, []);

  // Trigger real-time analysis on form changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performRealTimeAnalysis(formData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, performRealTimeAnalysis]);

  // 🚀 AUTONOMOUS QUALITY ORCHESTRATION SUBMISSION
  const handleAutonomousGeneration = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    setQualityMetrics(null);
    setAutonomousOptimizations([]);

    try {
      console.log('🧠 INITIATING AUTONOMOUS QUALITY ORCHESTRATION...');
      
      // Apply enterprise field mapping with AI enhancements
      const aiEnhancedPayload = {
        publication: formData.publication?.trim() || 'Default Publication',
        keyword: formData.keyword?.trim(),
        wordCount: parseInt(formData.wordCount) || 8000,
        affiliateLink: formData.affiliateLink?.trim() || '',
        sourceUrl: formData.sourceUrl?.trim() || '',
        sourceMaterial: formData.sourceMaterial?.trim() || '',
        company: formData.company?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        // AI Enhancement Flags
        enableAutonomousOptimization: true,
        qualityTargetScore: 95,
        realTimeAnalysis: realTimeAnalysis
      };

      console.log('📤 Sending AI-Enhanced Request:', aiEnhancedPayload);

      // Stage 1: Input Optimization
      setProcessingStage('🧠 AI analyzing and optimizing your input...');
      
      // Stage 2: Multi-Round Generation
      setTimeout(() => setProcessingStage('🚀 Multi-round content generation with quality loops...'), 3000);
      
      // Stage 3: Output Perfection  
      setTimeout(() => setProcessingStage('🎯 Autonomous output perfection in progress...'), 8000);
      
      // Stage 4: Quality Analysis
      setTimeout(() => setProcessingStage('📊 Final quality metrics and recommendations...'), 12000);

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiEnhancedPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ AI Generation Error:', errorData);
        throw new Error(errorData.details || errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ AUTONOMOUS QUALITY ORCHESTRATION COMPLETE:', result);

      if (result.success && result.article?.content) {
        setGeneratedContent(result.article.content);
        setQualityMetrics(result.article.qualityScore || result.metadata?.qualityMetrics);
        setAutonomousOptimizations(result.article.optimizations || []);
        setAiRecommendations(result.article.aiRecommendations || []);
        
        console.log(`🎊 SUCCESS: ${result.article.wordCount} words with ${result.article.qualityScore}% quality score!`);
      } else {
        throw new Error('Autonomous generation completed but no content received');
      }

    } catch (err) {
      console.error('🚨 Autonomous Generation Error:', err);
      setError(err.message || 'Autonomous content generation failed');
    } finally {
      setIsLoading(false);
      setProcessingStage('');
    }
  };

  // Download functionality with quality report
  const downloadContent = (format) => {
    if (!generatedContent) return;
    
    let downloadContent = generatedContent;
    
    if (format === 'with-report' && qualityMetrics) {
      downloadContent += '\n\n--- AUTONOMOUS QUALITY REPORT ---\n';
      downloadContent += `Overall Quality Score: ${qualityMetrics.overallScore || qualityMetrics}%\n`;
      downloadContent += `Word Count Accuracy: ${qualityMetrics.wordCountAccuracy}%\n`;
      downloadContent += `SEO Optimization: ${qualityMetrics.seoOptimization}%\n`;
      downloadContent += `Keyword Optimization: ${qualityMetrics.keywordOptimization}%\n`;
      downloadContent += `\nAI Optimizations Applied:\n${autonomousOptimizations.map(opt => `- ${opt}`).join('\n')}`;
      downloadContent += `\nAI Recommendations:\n${aiRecommendations.map(rec => `- ${rec}`).join('\n')}`;
    }
    
    const blob = new Blob([downloadContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.keyword.replace(/\s+/g, '-')}-quality-${format}.txt`;
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
        {/* Enhanced Header with AI Branding */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Brain size={32} style={{ color: '#667eea' }} />
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Autonomous Quality Intelligence System
            </h1>
            <Award size={32} style={{ color: '#764ba2' }} />
          </div>
          <p style={{ fontSize: '1.3rem', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
            AI-Orchestrated Content Generation with Multi-Layer Quality Loops
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px', color: '#9ca3af' }}>
            <span>🧠 Input Optimization</span>
            <span>🔄 Quality Loops</span>
            <span>🎯 Output Perfection</span>
            <span>📊 Continuous Learning</span>
          </div>
        </div>

        {/* Real-Time AI Analysis Dashboard */}
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
              Real-Time AI Analysis Dashboard
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
                <div style={{ fontWeight: 'bold', color: '#374151' }}>Keyword Strength</div>
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

            {aiRecommendations.length > 0 && (
              <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#6b46c1' }}>🤖 AI Recommendations:</div>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#374151' }}>
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Left Column - Enhanced Input Fields */}
          <div>
            {/* TIER 1: STRATEGIC CONTENT */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '12px', color: '#92400e' }}>
                AI-Enhanced Input
              </div>
              
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
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#92400e'
                }}>
                  Publication Target * {realTimeAnalysis.publicationAlignment > 0 && (
                    <span style={{ color: realTimeAnalysis.publicationAlignment >= 80 ? '#10b981' : '#f59e0b', fontSize: '12px' }}>
                      ({realTimeAnalysis.publicationAlignment}% match)
                    </span>
                  )}
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
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#92400e'
                }}>
                  Primary Keyword * {realTimeAnalysis.keywordStrength > 0 && (
                    <span style={{ color: realTimeAnalysis.keywordStrength >= 80 ? '#10b981' : '#f59e0b', fontSize: '12px' }}>
                      ({realTimeAnalysis.keywordStrength}% strength)
                    </span>
                  )}
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
                  placeholder="lions mane benefits"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#92400e'
                }}>
                  Target Word Count * {realTimeAnalysis.wordCountOptimization > 0 && (
                    <span style={{ color: realTimeAnalysis.wordCountOptimization >= 80 ? '#10b981' : '#f59e0b', fontSize: '12px' }}>
                      ({realTimeAnalysis.wordCountOptimization}% optimal)
                    </span>
                  )}
                </label>
                <select
                  value={formData.wordCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, wordCount: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${realTimeAnalysis.wordCountOptimization >= 80 ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="8000">8,000 words (AI Recommended)</option>
                  <option value="6000">6,000 words</option>
                  <option value="4000">4,000 words</option>
                  <option value="10000">10,000 words</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#92400e'
                }}>
                  Affiliate Link (AI Auto-Integration)
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
                  placeholder="https://affiliate-link.com (3-5 natural placements)"
                />
              </div>
            </div>

            {/* TIER 2: SOURCE INTELLIGENCE - Enhanced */}
            <div style={{
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
              border: '2px solid #6366f1',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '12px', color: '#4338ca' }}>
                Zero Failure Policy
              </div>
              
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#4338ca',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Brain size={20} style={{ marginRight: '8px' }} />
                Source Intelligence (AI-Verified Accuracy)
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#4338ca'
                }}>
                  Source URL (AI Analysis)
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="https://source-research.com"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#4338ca'
                }}>
                  Source Material (AI Quality Assessment) {realTimeAnalysis.sourceQuality > 0 && (
                    <span style={{ color: realTimeAnalysis.sourceQuality >= 80 ? '#10b981' : '#f59e0b', fontSize: '12px' }}>
                      ({realTimeAnalysis.sourceQuality}% quality)
                    </span>
                  )}
                </label>
                <textarea
                  value={formData.sourceMaterial}
                  onChange={(e) => setFormData(prev => ({ ...prev, sourceMaterial: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${realTimeAnalysis.sourceQuality >= 80 ? '#10b981' : realTimeAnalysis.sourceQuality >= 60 ? '#f59e0b' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    height: '140px',
                    resize: 'vertical'
                  }}
                  placeholder="Paste source research, facts, studies, or specific requirements here. AI will analyze for gaps and enhance accuracy..."
                />
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Characters: {formData.sourceMaterial.length}</span>
                  <span style={{ color: realTimeAnalysis.sourceQuality >= 80 ? '#10b981' : '#f59e0b' }}>
                    AI Status: {realTimeAnalysis.sourceQuality >= 80 ? '✅ HIGH QUALITY' : realTimeAnalysis.sourceQuality >= 60 ? '🔧 GOOD' : '📝 NEEDS MORE'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 3: CONTACT INFORMATION */}
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                color: '#047857',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Settings size={20} style={{ marginRight: '8px' }} />
                Contact Information
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                  placeholder="Your Company Name"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Right Column - AI Processing & Results */}
          <div>
            {/* AI Generation Control Panel */}
            <button
              onClick={handleAutonomousGeneration}
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
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>AI Orchestration Active</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>{processingStage}</div>
                  </div>
                </>
              ) : (
                <>
                  <Brain size={24} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '18px' }}>Activate Autonomous Generation</div>
                    <div style={{ fontSize: '12px', opacity: '0.9' }}>4-Stage AI Quality Orchestration</div>
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
                  <strong>Autonomous System Error:</strong>
                </div>
                <p style={{ margin: '0', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            {/* Quality Metrics Dashboard */}
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
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Quality Achievement</div>
                    <div style={{ fontSize: '14px', opacity: '0.8' }}>AI-Verified Content Excellence</div>
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

                {typeof qualityMetrics === 'object' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#047857' }}>Word Count</div>
                      <div style={{ color: '#10b981' }}>{Math.round(qualityMetrics.wordCountAccuracy)}%</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#047857' }}>SEO Score</div>
                      <div style={{ color: '#10b981' }}>{Math.round(qualityMetrics.seoOptimization)}%</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#047857' }}>Keywords</div>
                      <div style={{ color: '#10b981' }}>{Math.round(qualityMetrics.keywordOptimization)}%</div>
                    </div>
                  </div>
                )}

                {autonomousOptimizations.length > 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#047857', fontSize: '14px' }}>🤖 Applied Optimizations:</div>
                    <div style={{ fontSize: '12px', color: '#059669' }}>
                      {autonomousOptimizations.slice(0, 4).join(' • ')}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={() => downloadContent('standard')}
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
                      fontSize: '14px'
                    }}
                  >
                    <Download size={16} />
                    Download Content
                  </button>
                  <button
                    onClick={() => downloadContent('with-report')}
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
                    <TrendingUp size={16} />
                    Download with AI Report
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Content Preview */}
            {generatedContent && (
              <div style={{
                background: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                <h4 style={{ margin: '0 0 16px 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} />
                  AI-Optimized Content Preview
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
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#4b5563',
                  whiteSpace: 'pre-wrap'
                }}>
                  {generatedContent.substring(0, 1500)}
                  {generatedContent.length > 1500 && (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                      ... ({Math.round((generatedContent.length - 1500) / 5)} more words)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Functions for Real-Time Analysis
function calculateKeywordStrength(keyword) {
  if (!keyword) return 0;
  let score = 50;
  if (keyword.length >= 3) score += 20;
  if (keyword.includes(' ')) score += 15; // Long-tail bonus
  if (/\b(benefits|review|guide|how to|best|top)\b/i.test(keyword)) score += 15;
  return Math.min(100, score);
}

function calculatePublicationAlignment(publication, keyword) {
  if (!publication || !keyword) return 0;
  let score = 60;
  
  // Health site alignment
  if (publication.includes('Health') && /\b(health|supplement|nutrition|wellness|medical)\b/i.test(keyword)) score += 40;
  // Tech site alignment  
  if (publication.includes('Tech') && /\b(software|technology|ai|digital|app)\b/i.test(keyword)) score += 40;
  // Finance site alignment
  if (publication.includes('Finance') && /\b(investment|money|financial|crypto|trading)\b/i.test(keyword)) score += 40;
  // News wire general alignment
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
  if (sourceMaterial.includes('http')) score += 10; // Has sources
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
  
  if (!formData.affiliateLink) {
    recommendations.push('Add an affiliate link to enable natural monetization integration throughout the content');
  }
  
  return recommendations;
}
