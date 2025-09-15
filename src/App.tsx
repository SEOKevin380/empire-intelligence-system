import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Zap, Loader2 } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
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

  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    console.log('Button clicked! Form data:', formData);
    console.log('Keyword value:', `"${formData.keyword}"`);
    console.log('Keyword length:', formData.keyword.length);
    console.log('Source Material length:', formData.sourceMaterial.length);
    
    // SIMPLIFIED validation - remove trim() and length checks that might be causing issues
    if (!formData.keyword) {
      setError('Please enter a Target Keyword');
      return;
    }
    
    if (!formData.publication) {
      setError('Please select a Publication');
      return;
    }
    
    if (formData.sourceMaterial.length < 50) {
      setError('Source Material must be at least 50 characters');
      return;
    }
    
    if (!formData.email && !formData.phone) {
      setError('Please provide either an email or phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      console.log('Making fetch request to /api/generate-content');
      console.log('Sending data:', JSON.stringify(formData, null, 2));
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.success && data.content) {
        setGeneratedContent(data);
        console.log('SUCCESS: Content generated!');
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }

    } catch (err) {
      console.error('ERROR in handleSubmit:', err);
      setError(err.message || 'Content generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Force attach click handler after render
  useEffect(() => {
    const button = document.querySelector('button[data-submit="true"]');
    if (button) {
      button.onclick = handleSubmit;
      console.log('Click handler attached via useEffect');
    }
  }, [formData]); // Add formData dependency to ensure handler updates

  // SIMPLIFIED validation for UI colors
  const validation = {
    publication: formData.publication.length > 0,
    keyword: formData.keyword.length > 0, // Simplified - just check if exists
    sourceMaterial: formData.sourceMaterial.length >= 50,
    contact: formData.email.length > 0 || formData.phone.length > 0
  };

  const allValid = validation.publication && validation.keyword && validation.sourceMaterial && validation.contact;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            Empire Intelligence System
          </h1>
          <p style={{ fontSize: '24px', margin: '0', opacity: 0.9 }}>
            V18.0 - Professional Content Generation
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px'
        }}>
          
          <div style={{ marginBottom: '20px' }}>
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
                border: validation.publication ? '2px solid #10b981' : '2px solid #ef4444',
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

          <div style={{ marginBottom: '20px' }}>
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
                border: validation.keyword ? '2px solid #10b981' : '2px solid #ef4444',
                fontSize: '16px'
              }}
            />
            {/* Debug info */}
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
              Debug: "{formData.keyword}" (length: {formData.keyword.length})
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
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
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            >
              <option value="5000">5,000 words</option>
              <option value="8000">8,000 words (Recommended)</option>
              <option value="10000">10,000 words</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
              Affiliate Link (Optional)
            </label>
            <input
              type="url"
              name="affiliateLink"
              value={formData.affiliateLink}
              onChange={handleInputChange}
              placeholder="https://your-affiliate-link.com"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
              Source Material * (MANDATORY)
            </label>
            <textarea
              name="sourceMaterial"
              value={formData.sourceMaterial}
              onChange={handleInputChange}
              placeholder="Paste your research material here (minimum 50 characters)"
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: validation.sourceMaterial ? '2px solid #10b981' : '2px solid #ef4444',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '12px', marginTop: '4px', color: '#6b7280' }}>
              Characters: {formData.sourceMaterial.length} | Required: 50+ | 
              Status: {validation.sourceMaterial ? '✅ Valid' : '❌ Too Short'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
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
                  border: validation.contact ? '2px solid #10b981' : '2px solid #ef4444',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
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
                  border: validation.contact ? '2px solid #10b981' : '2px solid #ef4444',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
            * Provide either email OR phone number (both recommended)
          </div>

          {/* Debug section */}
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Debug Info:</strong><br/>
            Publication: "{formData.publication}" ({validation.publication ? 'Valid' : 'Invalid'})<br/>
            Keyword: "{formData.keyword}" ({validation.keyword ? 'Valid' : 'Invalid'})<br/>
            Source Material: {formData.sourceMaterial.length} chars ({validation.sourceMaterial ? 'Valid' : 'Invalid'})<br/>
            Contact: {validation.contact ? 'Valid' : 'Invalid'}<br/>
            All Valid: {allValid ? 'YES' : 'NO'}
          </div>

          <button
            data-submit="true"
            disabled={isLoading || !allValid}
            style={{
              width: '100%',
              padding: '20px',
              background: isLoading || !allValid ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoading || !allValid ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '24px'
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
              
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>
                  Generated Content ({generatedContent.metadata?.wordCount || 'Unknown'} words):
                </h3>
                <div style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#4b5563'
                }}>
                  {generatedContent.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
