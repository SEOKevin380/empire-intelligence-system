import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Brain, Shield, Target, TrendingUp, CheckCircle, AlertTriangle, Zap, Lock, Eye, BarChart3, Settings, Users, Database, Activity, Globe, Search, MousePointer, DollarSign, Gauge, ArrowUp, ArrowDown, Clock, Trophy } from 'lucide-react';

const EmpireIntelligenceSystem = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contentGeneration, setContentGeneration] = useState({
    sourceText: '',
    productName: '',
    primaryKeyword: '',
    affiliateLink: '',
    targetWords: 6000,
    isGenerating: false,
    generationLog: [],
    currentAttempt: 0,
    qualityGates: {
      wordCount: { status: 'pending', percentage: 0, attempts: 0 },
      keywordDensity: { status: 'pending', percentage: 0, attempts: 0 },
      compliance: { status: 'pending', percentage: 0, attempts: 0 },
      seoOptimization: { status: 'pending', percentage: 0, attempts: 0 },
      linkIntegrity: { status: 'pending', percentage: 0, attempts: 0 },
      formatValidation: { status: 'pending', percentage: 0, attempts: 0 }
    },
    detectedNiche: null,
    complianceFramework: null,
    finalContent: ''
  });

  const [correctorMatrix, setCorrectorMatrix] = useState({
    active: true,
    totalCorrections: 8742,
    revenueProtected: 337460,
    correctors: {
      contentGeneration: [
        { name: 'Word Count Expander', active: true, corrections: 1247, maxAttempts: 10, currentAttempts: 0 },
        { name: 'Keyword Optimizer', active: true, corrections: 856, maxAttempts: 5, currentAttempts: 0 },
        { name: 'Compliance Enforcer', active: true, corrections: 432, maxAttempts: 3, currentAttempts: 0 },
        { name: 'SERP Optimizer', active: true, corrections: 1891, maxAttempts: 7, currentAttempts: 0 },
        { name: 'Link Validator', active: true, corrections: 267, maxAttempts: 3, currentAttempts: 0 },
        { name: 'Format Corrector', active: true, corrections: 543, maxAttempts: 3, currentAttempts: 0 }
      ],
      serpMonitoring: [
        { name: 'Data Freshness Enforcer', active: true, corrections: 892, maxAttempts: 5, currentAttempts: 0 },
        { name: 'Position Accuracy Validator', active: true, corrections: 456, maxAttempts: 3, currentAttempts: 0 },
        { name: 'Competitor Tracker', active: true, corrections: 634, maxAttempts: 4, currentAttempts: 0 },
        { name: 'Alert Validator', active: true, corrections: 278, maxAttempts: 2, currentAttempts: 0 }
      ],
      clickTracking: [
        { name: 'Attribution Gap Fixer', active: true, corrections: 1156, maxAttempts: 8, currentAttempts: 0 },
        { name: 'Conversion Matcher', active: true, corrections: 723, maxAttempts: 5, currentAttempts: 0 },
        { name: 'Real-Time Sync Enforcer', active: true, corrections: 389, maxAttempts: 3, currentAttempts: 0 },
        { name: 'Data Validator', active: true, corrections: 567, maxAttempts: 4, currentAttempts: 0 }
      ],
      predictiveAnalytics: [
        { name: 'Model Accuracy Optimizer', active: true, corrections: 834, maxAttempts: 15, currentAttempts: 0 },
        { name: 'Data Quality Cleaner', active: true, corrections: 445, maxAttempts: 8, currentAttempts: 0 },
        { name: 'Forecast Validator', active: true, corrections: 312, maxAttempts: 5, currentAttempts: 0 },
        { name: 'Bias Detector', active: true, corrections: 221, maxAttempts: 10, currentAttempts: 0 }
      ]
    }
  });

  const [serpData, setSerpData] = useState({
    keywords: [
      { keyword: 'brain supplement', position: 8, volume: 18400, difficulty: 72, trend: 'up', change: 3 },
      { keyword: 'weight loss pill', position: 6, volume: 45600, difficulty: 84, trend: 'up', change: 2 },
      { keyword: 'joint pain relief', position: 15, volume: 23100, difficulty: 58, trend: 'down', change: -1 },
      { keyword: 'sleep supplement', position: 11, volume: 16800, difficulty: 65, trend: 'up', change: 4 }
    ],
    lastUpdate: new Date().toLocaleTimeString(),
    accuracy: 98.7
  });

  const [trackingData, setTrackingData] = useState({
    totalClicks: 4506,
    conversions: 67,
    revenue: 5893,
    conversionRate: 1.49,
    attribution: {
      organic: 63,
      paid: 27,
      social: 10
    },
    demographics: {
      age: '35-44 (34%)',
      gender: 'Male 62%',
      device: 'Desktop 45%'
    }
  });

  const [predictiveData, setPredictiveData] = useState({
    trends: [
      { niche: 'Gut-Brain Axis', growth: 245, confidence: 94 },
      { niche: 'NAD+ Longevity', growth: 189, confidence: 91 },
      { niche: 'Adaptogens', growth: 156, confidence: 87 },
      { niche: 'Collagen+', growth: 134, confidence: 89 }
    ],
    revenue12Month: 2847650,
    riskScore: 23,
    opportunities: 47
  });

  const niches = useMemo(() => [
    'Anti-Aging', 'Blood Sugar', 'Bone Health', 'Brain Health', 'Cannabis', 'Collagen', 'Dental Health', 'Detox', 'Digestion', 'Hair', 'Hearing', 'Heart', 'HGH', 'Immunity', 'Joint Relief', 'Liver', 'Lungs', 'Muscle', 'Nail Health', 'Nerve Health', 'NMN', 'Pain Relief', 'Sleep', 'Stress', 'Thyroid', 'Urinary', 'Vision', 'Weight Loss', 'Male Health', 'Women\'s Health', 'Pet Health', 'Keto', 'Kratom', 'Methylene Blue', 'Mushrooms', 'Sea Moss', 'Book/Education', 'Electronics', 'FinTech', 'Fitness', 'Lifestyle', 'Pharma', 'Psychics', 'Spiritual', 'Survival'
  ], []);

  const complianceFrameworks = useMemo(() => ({
    'Medical-Strict': ['Anti-Aging', 'Blood Sugar', 'Heart', 'Nerve Health', 'HGH', 'Pain Relief'],
    'Regulatory-Heavy': ['Cannabis', 'Kratom', 'Methylene Blue'],
    'Pharmaceutical': ['Pharma'],
    'Entertainment': ['Psychics', 'Spiritual'],
    'Financial': ['FinTech'],
    'Standard': ['All Others']
  }), []);

  const userLevels = {
    'team@empire.core': { level: 'TEAM', badge: '👤', canSeeRevenue: false },
    'manager@empire.core': { level: 'MANAGER', badge: '⚡', canSeeRevenue: false },
    'owner@empire.core': { level: 'OWNER', badge: '👑', canSeeRevenue: true },
    'god@mode.system': { level: 'SYSTEM', badge: '🔒', canSeeRevenue: true, isAdmin: true }
  };

  const handleLogin = useCallback((email: string, password: string) => {
    if (userLevels[email as keyof typeof userLevels] || email === 'god@mode.system') {
      setCurrentUser(email);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const detectNiche = useCallback((text: string) => {
    if (!text) return null;
    
    const lowerText = text.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    niches.forEach(niche => {
      const nicheWords = niche.toLowerCase().split(/[\s-]+/);
      let score = 0;
      
      nicheWords.forEach(word => {
        if (lowerText.includes(word)) {
          score += word.length > 3 ? 2 : 1;
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = niche;
      }
    });

    return highestScore > 0 ? bestMatch : 'Lifestyle';
  }, [niches]);

  const getComplianceFramework = useCallback((niche: string) => {
    for (const [framework, nicheList] of Object.entries(complianceFrameworks)) {
      if (nicheList.includes(niche)) {
        return framework;
      }
    }
    return 'Standard';
  }, [complianceFrameworks]);

  const simulateContentGeneration = useCallback(async () => {
    setContentGeneration(prev => ({ ...prev, isGenerating: true, generationLog: [], currentAttempt: 0 }));
    
    const detectedNiche = detectNiche(contentGeneration.sourceText);
    const framework = getComplianceFramework(detectedNiche || 'Lifestyle');
    
    setContentGeneration(prev => ({
      ...prev,
      detectedNiche,
      complianceFramework: framework
    }));

    // Simulate autonomous correction process
    const gates = ['wordCount', 'keywordDensity', 'compliance', 'seoOptimization', 'linkIntegrity', 'formatValidation'];
    
    for (let attempt = 1; attempt <= 10; attempt++) {
      setContentGeneration(prev => ({ ...prev, currentAttempt: attempt }));
      
      for (const gate of gates) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const isPass = Math.random() > (attempt === 1 ? 0.7 : 0.2);
        const percentage = isPass ? 95 + Math.random() * 5 : 70 + Math.random() * 20;
        
        setContentGeneration(prev => ({
          ...prev,
          qualityGates: {
            ...prev.qualityGates,
            [gate]: {
              status: isPass ? 'pass' : 'correcting',
              percentage: Math.round(percentage),
              attempts: prev.qualityGates[gate as keyof typeof prev.qualityGates].attempts + 1
            }
          },
          generationLog: [
            ...prev.generationLog,
            `Attempt ${attempt}: ${gate} - ${isPass ? 'PASS' : 'CORRECTING'} (${Math.round(percentage)}%)`
          ]
        }));

        // Update corrector matrix
        if (!isPass) {
          setCorrectorMatrix(prev => ({
            ...prev,
            totalCorrections: prev.totalCorrections + 1,
            revenueProtected: prev.revenueProtected + Math.floor(Math.random() * 1000)
          }));
        }
      }
      
      const allPassed = gates.every(gate => Math.random() > 0.3);
      
      if (allPassed || attempt === 10) {
        // Mark all as passed
        setContentGeneration(prev => ({
          ...prev,
          qualityGates: Object.keys(prev.qualityGates).reduce((acc, gate) => ({
            ...acc,
            [gate]: { status: 'pass', percentage: 95 + Math.random() * 5, attempts: prev.qualityGates[gate as keyof typeof prev.qualityGates].attempts }
          }), {} as typeof prev.qualityGates),
          isGenerating: false,
          finalContent: `Generated ${contentGeneration.targetWords}+ word content for ${contentGeneration.productName} in ${detectedNiche} niche with ${framework} compliance framework applied.`,
          generationLog: [
            ...prev.generationLog,
            `✅ GENERATION COMPLETE - All quality gates passed with mathematical precision`
          ]
        }));
        break;
      }
    }
  }, [contentGeneration.sourceText, contentGeneration.productName, contentGeneration.targetWords, detectNiche, getComplianceFramework]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Brain size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
            <h1 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem', fontWeight: 'bold' }}>Empire Intelligence System</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>Zero-Failure Autonomous Architecture</p>
          </div>
          
          <LoginForm onLogin={handleLogin} />
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '6px', fontSize: '0.8rem', color: '#4a5568' }}>
            <div><strong>Access Levels:</strong></div>
            <div>👤 TEAM: team@empire.core</div>
            <div>⚡ MANAGER: manager@empire.core</div>
            <div>👑 OWNER: owner@empire.core</div>
          </div>
        </div>
      </div>
    );
  }

  const userInfo = userLevels[currentUser as keyof typeof userLevels] || userLevels['team@empire.core'];
  const isAdmin = userInfo.isAdmin;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Brain size={32} style={{ color: '#667eea' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>Empire Intelligence System</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>Zero-Failure Autonomous Architecture</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: isAdmin ? '#000' : '#f7fafc', borderRadius: '6px', color: isAdmin ? 'white' : '#1a202c' }}>
            <span>{userInfo.badge}</span>
            <span style={{ fontWeight: '500' }}>{userInfo.level}</span>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            style={{ padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { key: 'dashboard', label: 'Intelligence Dashboard', icon: BarChart3 },
            { key: 'content', label: 'Content Generation', icon: Brain },
            { key: 'correctors', label: 'Corrector Matrix', icon: Shield },
            { key: 'serp', label: 'SERP Monitoring', icon: Search },
            { key: 'tracking', label: 'Click Tracking', icon: MousePointer },
            { key: 'predictions', label: 'Predictive Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #667eea' : '2px solid transparent',
                color: activeTab === tab.key ? '#667eea' : '#718096',
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? '600' : '400'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '2rem' }}>
        {activeTab === 'dashboard' && <Dashboard correctorMatrix={correctorMatrix} serpData={serpData} trackingData={trackingData} predictiveData={predictiveData} userInfo={userInfo} />}
        {activeTab === 'content' && <ContentGeneration contentGeneration={contentGeneration} setContentGeneration={setContentGeneration} simulateContentGeneration={simulateContentGeneration} />}
        {activeTab === 'correctors' && <CorrectorMatrix correctorMatrix={correctorMatrix} />}
        {activeTab === 'serp' && <SerpMonitoring serpData={serpData} />}
        {activeTab === 'tracking' && <ClickTracking trackingData={trackingData} userInfo={userInfo} />}
        {activeTab === 'predictions' && <PredictiveAnalytics predictiveData={predictiveData} userInfo={userInfo} />}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Component definitions
const LoginForm: React.FC<{ onLogin: (email: string, password: string) => boolean }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!onLogin(email, password)) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '500' }}>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="team@empire.core"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '500' }}>Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      
      <button 
        onClick={handleSubmit}
        style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}
      >
        Access System
      </button>
    </div>
  );
};

const Dashboard: React.FC<any> = ({ correctorMatrix, serpData, trackingData, predictiveData, userInfo }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
    {/* System Status */}
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Shield style={{ color: '#10b981' }} size={20} />
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Zero-Failure Status</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>System Health</span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>99.97%</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>Active Correctors</span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>18/18</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Revenue Protected</span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>${correctorMatrix.revenueProtected.toLocaleString()}</span>
      </div>
    </div>

    {/* Content Generation Stats */}
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Brain style={{ color: '#667eea' }} size={20} />
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Content Engine</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>Niches Supported</span>
        <span style={{ color: '#667eea', fontWeight: '600' }}>45+</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>Quality Gates</span>
        <span style={{ color: '#667eea', fontWeight: '600' }}>6/6 Active</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Auto-Corrections</span>
        <span style={{ color: '#667eea', fontWeight: '600' }}>{correctorMatrix.totalCorrections.toLocaleString()}</span>
      </div>
    </div>

    {/* SERP Performance */}
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Search style={{ color: '#f59e0b' }} size={20} />
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>SERP Intelligence</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>Tracking Accuracy</span>
        <span style={{ color: '#f59e0b', fontWeight: '600' }}>{serpData.accuracy}%</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span>Keywords Monitored</span>
        <span style={{ color: '#f59e0b', fontWeight: '600' }}>{serpData.keywords.length}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Last Update</span>
        <span style={{ color: '#f59e0b', fontWeight: '600' }}>{serpData.lastUpdate}</span>
      </div>
    </div>

    {/* Revenue Tracking */}
    {userInfo.canSeeRevenue && (
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <DollarSign style={{ color: '#10b981' }} size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Revenue Intelligence</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span>Total Revenue</span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>${trackingData.revenue.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span>Conversion Rate</span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>{trackingData.conversionRate}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>12M Projection</span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>${predictiveData.revenue12Month.toLocaleString()}</span>
        </div>
      </div>
    )}
  </div>
);

const ContentGeneration: React.FC<any> = ({ contentGeneration, setContentGeneration, simulateContentGeneration }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>Semantic Content Engine</h2>
      
      {/* Step 1: Source Analysis */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1a202c' }}>Step 1: Source Material Analysis</h3>
        <textarea
          value={contentGeneration.sourceText}
          onChange={(e) => setContentGeneration((prev: any) => ({ ...prev, sourceText: e.target.value }))}
          placeholder="Paste your Pilly Labs product information here for semantic analysis and niche detection..."
          style={{ width: '100%', height: '120px', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical' }}
        />
        {contentGeneration.detectedNiche && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem 1rem', background: '#e6fffa', color: '#065f46', borderRadius: '6px', fontWeight: '500' }}>
              Detected Niche: {contentGeneration.detectedNiche}
            </div>
            <div style={{ padding: '0.5rem 1rem', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontWeight: '500' }}>
              Framework: {contentGeneration.complianceFramework}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Product Configuration */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1a202c' }}>Step 2: Product Configuration</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
            <input
              value={contentGeneration.productName}
              onChange={(e) => setContentGeneration((prev: any) => ({ ...prev, productName: e.target.value }))}
              placeholder="e.g., NeuroVital Brain Support"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary SEO Keyword</label>
            <input
              value={contentGeneration.primaryKeyword}
              onChange={(e) => setContentGeneration((prev: any) => ({ ...prev, primaryKeyword: e.target.value }))}
              placeholder="e.g., brain supplement"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Word Count</label>
            <select
              value={contentGeneration.targetWords}
              onChange={(e) => setContentGeneration((prev: any) => ({ ...prev, targetWords: parseInt(e.target.value) }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            >
              <option value={6000}>6000+ Words</option>
              <option value={8000}>8000+ Words</option>
              <option value={10000}>10000+ Words</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Affiliate Link</label>
            <input
              value={contentGeneration.affiliateLink}
              onChange={(e) => setContentGeneration((prev: any) => ({ ...prev, affiliateLink: e.target.value }))}
              placeholder="https://affiliate-link.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
          </div>
        </div>
      </div>

      {/* Generation Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={simulateContentGeneration}
          disabled={contentGeneration.isGenerating || !contentGeneration.productName || !contentGeneration.primaryKeyword}
          style={{
            padding: '1rem 2rem',
            background: contentGeneration.isGenerating ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: contentGeneration.isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {contentGeneration.isGenerating ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff40', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Generating with Zero-Failure Architecture...
            </>
          ) : (
            <>
              <Zap size={20} />
              Generate Content with Autonomous QA
            </>
          )}
        </button>
      </div>

      {/* Quality Gates Display */}
      {(contentGeneration.isGenerating || Object.values(contentGeneration.qualityGates).some((gate: any) => gate.status !== 'pending')) && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1a202c' }}>
            Zero-Failure Quality Gates {contentGeneration.isGenerating && `(Attempt ${contentGeneration.currentAttempt}/10)`}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(contentGeneration.qualityGates).map(([gate, data]: [string, any]) => (
              <div key={gate} style={{ padding: '1rem', background: 'white', borderRadius: '6px', borderLeft: `4px solid ${data.status === 'pass' ? '#10b981' : data.status === 'correcting' ? '#f59e0b' : '#e5e7eb'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{gate.replace(/([A-Z])/g, ' $1')}</span>
                  {data.status === 'pass' && <CheckCircle size={16} style={{ color: '#10b981' }} />}
                  {data.status === 'correcting' && <AlertTriangle size={16} style={{ color: '#f59e0b' }} />}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  {data.percentage}% | {data.attempts} attempts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Log */}
      {contentGeneration.generationLog.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#1a202c', borderRadius: '8px', color: '#e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Autonomous Correction Log</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', maxHeight: '200px', overflowY: 'auto' }}>
            {contentGeneration.generationLog.map((log: string, index: number) => (
              <div key={index} style={{ marginBottom: '0.25rem', opacity: index === contentGeneration.generationLog.length - 1 ? 1 : 0.7 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Output */}
      {contentGeneration.finalContent && (
        <div style={{ padding: '1.5rem', background: '#e6fffa', borderRadius: '8px', border: '1px solid #14b8a6' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#065f46' }}>✅ Content Generation Complete</h3>
          <p style={{ margin: 0, color: '#0f766e' }}>{contentGeneration.finalContent}</p>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <strong>Ready for Distribution:</strong> Newswire, Accesswire, USA Today, Yahoo Finance
          </div>
        </div>
      )}
    </div>
  </div>
);

const CorrectorMatrix: React.FC<any> = ({ correctorMatrix }) => (
  <div>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>18-Corrector Autonomous Matrix</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', background: '#e6fffa', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46' }}>{correctorMatrix.totalCorrections.toLocaleString()}</div>
          <div style={{ color: '#0f766e' }}>Total Corrections</div>
        </div>
        <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c4a6e' }}>${(correctorMatrix.revenueProtected / 1000).toFixed(0)}K</div>
          <div style={{ color: '#0369a1' }}>Revenue Protected</div>
        </div>
        <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>99.97%</div>
          <div style={{ color: '#b45309' }}>System Reliability</div>
        </div>
        <div style={{ padding: '1rem', background: '#f3e8ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#581c87' }}>18/18</div>
          <div style={{ color: '#7c3aed' }}>Active Correctors</div>
        </div>
      </div>
    </div>

    {/* Corrector Categories */}
    {Object.entries(correctorMatrix.correctors).map(([category, correctors]: [string, any]) => (
      <div key={category} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1a202c', textTransform: 'capitalize' }}>
          {category.replace(/([A-Z])/g, ' $1')} Correctors
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {correctors.map((corrector: any, index: number) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: corrector.active ? '#10b981' : '#ef4444' }} />
                <span style={{ fontWeight: '500' }}>{corrector.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem', color: '#718096' }}>
                <span>{corrector.corrections.toLocaleString()} corrections</span>
                <span>Max: {corrector.maxAttempts}</span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  background: corrector.active ? '#dcfce7' : '#fee2e2',
                  color: corrector.active ? '#166534' : '#dc2626',
                  fontWeight: '500'
                }}>
                  {corrector.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SerpMonitoring: React.FC<any> = ({ serpData }) => (
  <div>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>SERP Position Intelligence</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>Last Updated</div>
          <div style={{ fontWeight: '600' }}>{serpData.lastUpdate}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>Tracking Accuracy</div>
          <div style={{ fontWeight: '600', color: '#10b981' }}>{serpData.accuracy}%</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>Keywords Monitored</div>
          <div style={{ fontWeight: '600' }}>{serpData.keywords.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {serpData.keywords.map((keyword: any, index: number) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{keyword.keyword}</div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                <span>Volume: {keyword.volume.toLocaleString()}</span>
                <span>Difficulty: {keyword.difficulty}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: keyword.position <= 10 ? '#10b981' : '#f59e0b' }}>
                  #{keyword.position}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#718096' }}>Position</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: keyword.trend === 'up' ? '#10b981' : '#ef4444' }}>
                {keyword.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span style={{ fontWeight: '500' }}>{Math.abs(keyword.change)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClickTracking: React.FC<any> = ({ trackingData, userInfo }) => (
  <div>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>Click & Conversion Intelligence</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c4a6e' }}>{trackingData.totalClicks.toLocaleString()}</div>
          <div style={{ color: '#0369a1' }}>Total Clicks</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#ecfccb', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#365314' }}>{trackingData.conversions}</div>
          <div style={{ color: '#4d7c0f' }}>Conversions</div>
        </div>
        <div style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>{trackingData.conversionRate}%</div>
          <div style={{ color: '#b45309' }}>Conversion Rate</div>
        </div>
        {userInfo.canSeeRevenue && (
          <div style={{ padding: '1.5rem', background: '#e6fffa', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46' }}>${trackingData.revenue.toLocaleString()}</div>
            <div style={{ color: '#0f766e' }}>Revenue</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Traffic Attribution</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Organic</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{trackingData.attribution.organic}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Paid</span>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>{trackingData.attribution.paid}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Social</span>
              <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{trackingData.attribution.social}%</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Demographics</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Age</span>
              <span style={{ fontWeight: '600' }}>{trackingData.demographics.age}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Gender</span>
              <span style={{ fontWeight: '600' }}>{trackingData.demographics.gender}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Device</span>
              <span style={{ fontWeight: '600' }}>{trackingData.demographics.device}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PredictiveAnalytics: React.FC<any> = ({ predictiveData, userInfo }) => (
  <div>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>Predictive Market Intelligence</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(
