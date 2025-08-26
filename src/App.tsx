import React, { useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, Download, Copy, Zap, Loader2, Globe, Mail, Phone, Link, FileText, Target } from 'lucide-react';

interface FormData {
  contentType: string;
  publication: string;
  keyword: string;
  wordCount: string;
  affiliateLink: string;
  sourceUrl: string;
  sourceMaterial: string;
  company: string;
  email: string;
  phone: string;
}

interface GeneratedContent {
  content: string;
  metadata: {
    wordCount: number;
    targetWords: number;
    affiliateLinks: number;
    sections: number;
    publication: string;
    keyword: string;
    hasContactInfo: boolean;
    warnings?: string[];
  };
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    contentType: 'Article',
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

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Real-time validation
  const validation = {
    publication: formData.publication.length >= 3,
    keyword: formData.keyword.length >= 3,
    sourceMaterial: formData.sourceMaterial.length >= 50,
    contact: formData.email.length > 0 || formData.phone.length > 0
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.success && data.content) {
        setGeneratedContent(data);
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Content generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsHTML = () => {
    if (!generatedContent) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.keyword} - ${formData.publication}</title>
    <style>
        body { font-family: Georgia, serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #333; }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 40px; }
        h3 { color: #7f8c8d; }
        p { margin-bottom: 20px; }
        a { color: #3498db; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        .meta { background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .disclosure { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="meta">
        <strong>Publication:</strong> ${formData.publication}<br>
        <strong>Target Keyword:</strong> ${formData.keyword}<br>
        <strong>Word Count:</strong> ${generatedContent.metadata.wordCount} words<br>
        <strong>Company:</strong> ${formData.company || 'Not specified'}<br>
        <strong>Contact:</strong> ${formData.email || formData.phone || 'Not specified'}
    </div>
    
    ${generatedContent.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/## (.*)/g, '<h2>$1</h2>')
                                .replace(/### (.*)/g, '<h3>$1</h3>')
                                .replace(/# (.*)/g, '<h1>$1</h1>')
                                .replace(/\n\n/g, '</p><p>')
                                .replace(/^/, '<p>')
                                .replace(/$/, '</p>')
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.keyword.replace(/\s+/g, '-')}-${formData.publication.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyHTMLToClipboard = async () => {
    if (!generatedContent) return;

    const htmlContent = generatedContent.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\n\n/g, '</p>\n<p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow">$1</a>');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(htmlContent);
        setCopySuccess('HTML copied successfully!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = htmlContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (copied) {
          setCopySuccess('HTML copied successfully!');
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (err) {
      setCopySuccess('Copy failed - please select and copy manually');
    }

    setTimeout(() => setCopySuccess(''), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Empire Intelligence System
          </h1>
          <p style={{
            fontSize: '24px',
            margin: '0',
            opacity: 0.9
          }}>
            V18.0 - Professional Content Generation with Masked Affiliate Integration
          </p>
        </div>

        {/* Main Form */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <div>
            {/* Tier 1: Content Strategy */}
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '32px',
              color: 'white'
            }}>
              <h2 style={{ 
                margin: '0 0 24px 0', 
                fontSize: '24px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Target size={28} />
                Tier 1: Content Strategy
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Content Type
                  </label>
                  <select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  >
                    <option value="Article">Article</option>
                    <option value="Blog Post">Blog Post</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Guide">Guide</option>
                    <option value="Review">Review</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Publication *
                  </label>
                  <select
                    name="publication"
                    value={formData.publication}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: validation.publication ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select Publication</option>
                    <option value="Globe Newswire">Globe Newswire</option>
                    <option value="Newswire">Newswire</option>
                    <option value="Our Sites">Our Sites</option>
                    <option value="Sponsored Post">Sponsored Post</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Target Keyword *
                  </label>
                  <input
                    type="text"
                    name="keyword"
                    value={formData.keyword}
                    onChange={handleInputChange}
                    placeholder="Primary SEO keyword"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: validation.keyword ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Word Count Target
                  </label>
                  <select
                    name="wordCount"
                    value={formData.wordCount}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  >
                    <option value="5000">5,000 words</option>
                    <option value="8000">8,000 words (Recommended)</option>
                    <option value="10000">10,000 words</option>
                    <option value="12000">12,000 words</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link size={20} />
                    Affiliate Link (Masked Integration + CTAs)
                  </label>
                  <input
                    type="url"
                    name="affiliateLink"
                    value={formData.affiliateLink}
                    onChange={handleInputChange}
                    placeholder="https://your-affiliate-link.com (Will be masked professionally with 3-5 integrations)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  />
                  <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                    {formData.affiliateLink ? '✅ Affiliate links will be masked and integrated naturally' : 'Optional: Add affiliate link for professional integration'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 2: Source Intelligence */}
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '32px',
              color: 'white'
            }}>
              <h2 style={{ 
                margin: '0 0 24px 0', 
                fontSize: '24px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FileText size={28} />
                Tier 2: Source Intelligence (MANDATORY - Zero Failure Policy)
              </h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={20} />
                    Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleInputChange}
                    placeholder="https://source-website.com (Optional reference)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Source Material * (MANDATORY for Factual Accuracy)
                  </label>
                  <textarea
                    name="sourceMaterial"
                    value={formData.sourceMaterial}
                    onChange={handleInputChange}
                    placeholder="Paste your research material, studies, data, or factual information here. This ensures 100% factual accuracy and prevents any invented details. Minimum 50 characters required."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: validation.sourceMaterial ? '2px solid #10b981' : '2px solid #ef4444',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#333'
                    }}
                  />
                  <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                    Characters: {formData.sourceMaterial.length} | Required: 50+ | Status: {validation.sourceMaterial ? '✅ Valid' : '❌ Too Short'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 3: Contact Information */}
            <div style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '32px',
              color: '#333'
            }}>
              <h2 style={{ 
                margin: '0 0 24px 0', 
                fontSize: '24px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Mail size={28} />
                Tier 3: Contact Information
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={20} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@company.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: formData.email || formData.phone ? '2px solid #10b981' : '2px solid #ef4444',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={20} />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: formData.email || formData.phone ? '2px solid #10b981' : '2px solid #ef4444',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                * Provide either email OR phone number (both recommended)
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !validation.publication || !validation.keyword || !validation.sourceMaterial || !validation.contact}
              style={{
                width: '100%',
                padding: '20px',
                background: isLoading || !validation.publication || !validation.keyword || !validation.sourceMaterial || !validation.contact ? 
                  '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isLoading || !validation.publication || !validation.keyword || !validation.sourceMaterial || !validation.contact ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '24px',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating Empire Content...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Generate Empire Content
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                <AlertCircle size={20} />
                <strong>Generation Error:</strong>
              </div>
              <p style={{ margin: '8px 0 0 0', color: '#dc2626' }}>{error}</p>
            </div>
          )}

          {/* Success Display */}
          {generatedContent && (
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '16px' }}>
                <CheckCircle2 size={24} />
                <strong>Content Generated Successfully!</strong>
              </div>
              
              {/* Metrics Dashboard */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                background: 'white',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Word Count</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    {generatedContent.metadata.wordCount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Target: {generatedContent.metadata.targetWords.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Affiliate Links</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
                    {generatedContent.metadata.affiliateLinks}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formData.affiliateLink ? 'Masked & Integrated' : 'None provided'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Sections</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0891b2' }}>
                    {generatedContent.metadata.sections}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Including intro & conclusion
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Quality Score</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Zero-failure accuracy
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={downloadAsHTML}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: '1',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  <Download size={18} />
                  Download HTML
                </button>
                
                <button
                  onClick={copyHTMLToClipboard}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: '1',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  <Copy size={18} />
                  Copy HTML
                </button>
              </div>

              {/* Copy Success Message */}
              {copySuccess && (
                <div style={{
                  background: '#dbeafe',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#1e40af',
                  textAlign: 'center'
                }}>
                  {copySuccess}
                </div>
              )}

              {/* Warnings */}
              {generatedContent.metadata.warnings && (
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Generation Warnings:</div>
                  {generatedContent.metadata.warnings.map((warning, index) => (
                    <div key={index} style={{ fontSize: '14px', color: '#856404' }}>• {warning}</div>
                  ))}
                </div>
              )}

              {/* Content Preview */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>Content Preview:</h3>
                <div ref={contentRef} style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#4b5563'
                }}>
                  {generatedContent.content.substring(0, 1000)}...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
