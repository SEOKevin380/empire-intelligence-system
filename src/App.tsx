// Add this to your App.tsx state variables (around line 20)
const [modelTier, setModelTier] = useState('efficient');

// Add this section to your form (after the platform selection dropdown)
<div>
  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
    AI Model Quality:
  </label>
  <select
    value={modelTier}
    onChange={(e) => setModelTier(e.target.value)}
    style={{
      width: '100%', padding: '12px', borderRadius: '8px',
      border: '2px solid #ddd', fontSize: '16px'
    }}
  >
    <option value="efficient">Efficient (Claude 3 Haiku - Fast & Low Cost)</option>
    <option value="standard">Standard (Claude 3 Sonnet - Balanced)</option>
    <option value="premium">Premium (Claude 3.5 Sonnet - Maximum Quality)</option>
  </select>
  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
    {modelTier === 'efficient' && 'Cost: ~$0.06-$0.10 per article • Speed: Very Fast'}
    {modelTier === 'standard' && 'Cost: ~$0.15-$0.25 per article • Speed: Moderate'}
    {modelTier === 'premium' && 'Cost: ~$0.25-$0.40 per article • Speed: Slower but highest quality'}
  </div>
</div>

// Update your generateContent function to include modelTier in the API call (around line 120)
body: JSON.stringify({
  niche: selectedNiche,
  contentType,
  platform,
  sourceMaterial,
  targetAudience,
  wordCount,
  additionalRequirements,
  keyword,
  affiliateLink,
  companyName,
  email,
  phone,
  authorCredentials,
  modelTier  // Add this line
}),
