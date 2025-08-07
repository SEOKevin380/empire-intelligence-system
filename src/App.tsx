import React, { useState, useEffect } from 'react';
import { Brain, Database, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, Zap, BarChart3, Settings, Eye, Shield, Globe, Users, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sample data for demonstration
  const [stats] = useState({
    totalRevenue: 0,
    activeModules: 4,
    domainsTracked: 0,
    uptime: 99.999,
    predictionsAccuracy: 0,
    competitorsTracked: 0,
    opportunitiesValue: 0
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'empire@admin.core' || loginEmail === 'partner@empire.com') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Try: empire@admin.core');
    }
  };

  const modules = [
    { id: 'dashboard', name: 'Command Center', icon: Brain, color: '#8b5cf6' },
    { id: 'intelligence', name: 'Market Intelligence', icon: Eye, color: '#3b82f6' },
    { id: 'predictions', name: 'Prediction Engine', icon: TrendingUp, color: '#10b981' },
    { id: 'domains', name: 'Empire Domains', icon: Globe, color: '#f59e0b' },
  ];

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          width: '400px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Shield size={64} style={{ color: '#a78bfa', margin: '0 auto 20px auto', display: 'block' }} />
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              Empire Intelligence
            </h1>
            <p style={{ color: '#e0e7ff', margin: '0' }}>Secure Access Portal</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#8b5cf6',
                color: 'white',
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#7c3aed'}
              onMouseOut={(e) => e.currentTarget.style.background = '#8b5cf6'}
            >
              Access Empire
            </button>
          </form>
          
          <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#e0e7ff' }}>
            <p style={{ margin: '5px 0' }}>Demo Credentials:</p>
            <p style={{ margin: '0', fontWeight: '500' }}>empire@admin.core</p>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '15px',
          padding: '25px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>Total Revenue</p>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '15px',
          padding: '25px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>Active Modules</p>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeModules}</p>
            </div>
            <Brain size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: '15px',
          padding: '25px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>System Uptime</p>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.uptime}%</p>
            </div>
            <Activity size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: '15px',
          padding: '25px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>Prediction Accuracy</p>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.predictionsAccuracy}%</p>
            </div>
            <Target size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
            Revenue Intelligence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Domain Portfolio</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>
                $0.00
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Affiliate Network</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>
                $0.00
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Intelligence Services</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>
                $0.00
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Eye size={20} style={{ color: '#3b82f6' }} />
            Market Intelligence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Prediction Accuracy</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>{stats.predictionsAccuracy}%</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Market Opportunities</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>
                $0.00
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <span>Active Domains</span>
              <span style={{ fontWeight: '600' }}>{stats.domainsTracked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Brain size={32} style={{ color: '#8b5cf6', marginRight: '12px' }} />
            <h1 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              Empire Intelligence System
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Welcome, Empire Admin</span>
            <button
              onClick={() => setIsLoggedIn(false)}
              style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          {/* Sidebar */}
          <aside style={{
            width: '250px',
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: isActive ? '#8b5cf6' : 'transparent',
                      color: isActive ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon size={20} style={{ marginRight: '12px' }} />
                    {module.name}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
                {modules.find(m => m.id === activeModule)?.name || 'Dashboard'}
              </h2>
              <p style={{ margin: '0', color: '#6b7280' }}>
                {activeModule === 'dashboard' && 'Complete overview of your empire operations'}
                {activeModule === 'intelligence' && 'Market intelligence and competitor analysis'}
                {activeModule === 'predictions' && 'AI-powered market predictions and forecasts'}
                {activeModule === 'domains' && 'Domain portfolio management and analytics'}
              </p>
            </div>

            {activeModule === 'dashboard' && renderDashboard()}
            
            {activeModule !== 'dashboard' && (
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '40px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  {React.createElement(modules.find(m => m.id === activeModule)?.icon || Brain, {
                    size: 32,
                    style: { color: '#8b5cf6' }
                  })}
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                  {modules.find(m => m.id === activeModule)?.name} Module
                </h3>
                <p style={{ margin: '0 0 25px 0', color: '#6b7280' }}>
                  This module is ready for development. Add your specific functionality here.
                </p>
                <button style={{
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Configure Module
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
