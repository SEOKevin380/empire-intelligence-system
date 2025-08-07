import React, { useState } from 'react';
import { Brain, Database, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, Zap, BarChart3, Settings, Eye, Shield, Globe, Users, DollarSign, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'manager' | 'team' | 'secret_admin'>('team');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sample data for demonstration
  const [stats] = useState({
    totalRevenue: 0,
    activeModules: 5,
    domainsTracked: 0,
    uptime: 99.999,
    predictionsAccuracy: 0,
    competitorsTracked: 0,
    opportunitiesValue: 0,
    trafficData: 0,
    conversionRate: 0,
    activeUsers: 0
  });

  // Content system state
  const [contentItems, setContentItems] = useState([
    { id: 1, title: 'Welcome to Empire Intelligence', type: 'Article', status: 'Published', author: 'System', date: '2025-08-06', domain: 'Main Site' },
    { id: 2, title: 'Getting Started Guide', type: 'Guide', status: 'Draft', author: 'Team Member', date: '2025-08-06', domain: 'Knowledge Base' }
  ]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'Article',
    content: '',
    domain: 'Main Site',
    status: 'Draft'
  });

  // User accounts with different access levels
  const userAccounts = [
    { email: 'owner@empire.core', role: 'owner', name: 'Empire Owner' },
    { email: 'manager@empire.core', role: 'manager', name: 'Empire Manager' },
    { email: 'team@empire.core', role: 'team', name: 'Team Member' },
    { email: 'god@mode.system', role: 'secret_admin', name: 'System Administrator' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userAccounts.find(u => u.email === loginEmail);
    if (user) {
      setUserRole(user.role as 'owner' | 'manager' | 'team' | 'secret_admin');
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Try: owner@empire.core, manager@empire.core, or team@empire.core');
    }
  };

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    const content = {
      ...newContent,
      id: contentItems.length + 1,
      author: userAccounts.find(u => u.role === userRole)?.name || 'User',
      date: new Date().toISOString().split('T')[0]
    };
    setContentItems([...contentItems, content]);
    setNewContent({ title: '', type: 'Article', content: '', domain: 'Main Site', status: 'Draft' });
    setShowContentForm(false);
  };

  // Permission system
  const hasAccess = (feature: 'revenue' | 'traffic' | 'advanced') => {
    if (userRole === 'secret_admin') return true;
    if (userRole === 'owner') return true;
    if (userRole === 'manager' && feature !== 'revenue') return true;
    if (userRole === 'team' && feature !== 'revenue' && feature !== 'traffic') return true;
    return false;
  };

  const modules = [
    { id: 'dashboard', name: 'Command Center', icon: Brain, color: '#8b5cf6' },
    { id: 'content', name: 'Content System', icon: Database, color: '#06b6d4' },
    { id: 'intelligence', name: 'Market Intelligence', icon: Eye, color: '#3b82f6' },
    { id: 'predictions', name: 'Prediction Engine', icon: TrendingUp, color: '#10b981' },
    { id: 'domains', name: 'Empire Domains', icon: Globe, color: '#f59e0b' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'secret_admin': return '#000000';
      case 'owner': return '#dc2626';
      case 'manager': return '#8b5cf6';
      case 'team': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'secret_admin': return '🔒 SYSTEM';
      case 'owner': return '👑 OWNER';
      case 'manager': return '⚡ MANAGER';
      case 'team': return '👤 TEAM';
      default: return '👤 USER';
    }
  };

  const renderContentSystem = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* Content Actions Bar */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          Content Management
        </h3>
        <button
          onClick={() => setShowContentForm(!showContentForm)}
          style={{
            background: '#06b6d4',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Create Content
        </button>
      </div>

      {/* Content Creation Form */}
      {showContentForm && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
            Create New Content
          </h4>
          <form onSubmit={handleCreateContent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input
                type="text"
                placeholder="Content Title"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
              <select
                value={newContent.type}
                onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="Article">Article</option>
                <option value="Guide">Guide</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Review">Review</option>
                <option value="News">News</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <select
                value={newContent.domain}
                onChange={(e) => setNewContent({...newContent, domain: e.target.value})}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="Main Site">Main Site</option>
                <option value="Knowledge Base">Knowledge Base</option>
                <option value="Blog">Blog</option>
                <option value="Resources">Resources</option>
                <option value="Landing Pages">Landing Pages</option>
              </select>
              <select
                value={newContent.status}
                onChange={(e) => setNewContent({...newContent, status: e.target.value})}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="Draft">Draft</option>
                <option value="Review">Under Review</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <textarea
              placeholder="Content body..."
              value={newContent.content}
              onChange={(e) => setNewContent({...newContent, content: e.target.value})}
              rows={4}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              required
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Create Content
              </button>
              <button
                type="button"
                onClick={() => setShowContentForm(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content List */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
          Content Library ({contentItems.length} items)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contentItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                gap: '15px',
                padding: '15px',
                background: '#f9fafb',
                borderRadius: '10px',
                alignItems: 'center',
                fontSize: '14px'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{item.title}</div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>by {item.author}</div>
              </div>
              <span style={{ color: '#6b7280' }}>{item.type}</span>
              <span style={{ color: '#6b7280' }}>{item.domain}</span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                background: item.status === 'Published' ? '#dcfce7' : item.status === 'Review' ? '#fef3c7' : '#f3f4f6',
                color: item.status === 'Published' ? '#166534' : item.status === 'Review' ? '#92400e' : '#374151'
              }}>
                {item.status}
              </span>
              <span style={{ color: '#6b7280' }}>{item.date}</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Edit
                </button>
                {hasAccess('revenue') && (
                  <button style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '4px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Analytics - Only for Manager+ */}
      {hasAccess('traffic') && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
            Content Performance
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            <div style={{
              padding: '15px',
              background: '#f0f9ff',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>2,450</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Views</div>
            </div>
            <div style={{
              padding: '15px',
              background: '#f0fdf4',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>85%</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Engagement Rate</div>
            </div>
            <div style={{
              padding: '15px',
              background: '#fefce8',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>12</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Published This Month</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Access Level Notice */}
      <div style={{
        background: `linear-gradient(135deg, ${getRoleColor(userRole)}, ${getRoleColor(userRole)}dd)`,
        borderRadius: '15px',
        padding: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
          {getRoleBadge(userRole)} ACCESS LEVEL
        </h3>
        <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>
          {userRole === 'secret_admin' && 'Complete system control and backend access'}
          {userRole === 'owner' && 'Full access to all revenue, traffic, and operational data'}
          {userRole === 'manager' && 'Access to operational and traffic data (revenue restricted)'}
          {userRole === 'team' && 'Access to operational data only (revenue & traffic restricted)'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Revenue Card - Owner Only */}
        {hasAccess('revenue') && (
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
        )}
        
        {/* Active Modules - All Users */}
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
        
        {/* System Uptime - All Users */}
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
        
        {/* Traffic Data - Owner & Manager Only */}
        {hasAccess('traffic') && (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '15px',
            padding: '25px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>Active Users</p>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeUsers}</p>
              </div>
              <Users size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Add Secret Admin Panel - Only visible to secret_admin */}
        {userRole === 'secret_admin' && (
          <div style={{
            background: 'linear-gradient(135deg, #1f2937, #111827)',
            borderRadius: '15px',
            padding: '25px',
            color: 'white',
            border: '2px solid #374151'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Settings size={20} style={{ color: '#f59e0b' }} />
              System Control Panel
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              }}>
                <span>Database Access</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>ACTIVE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              }}>
                <span>User Management</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>ENABLED</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              }}>
                <span>System Logs</span>
                <span style={{ fontWeight: '600', color: '#f59e0b' }}>MONITORING</span>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Intelligence - Owner Only */}
        {hasAccess('revenue') && (
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
                <span style={{ fontWeight: '600', color: '#6b7280' }}>$0.00</span>
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
                <span style={{ fontWeight: '600', color: '#6b7280' }}>$0.00</span>
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
                <span style={{ fontWeight: '600', color: '#6b7280' }}>$0.00</span>
              </div>
            </div>
          </div>
        )}

        {/* Operational Intelligence - All Users */}
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
            Operational Intelligence
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
              <span>Competitors Tracked</span>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>{stats.competitorsTracked}</span>
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
          width: '450px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Shield size={64} style={{ color: '#a78bfa', margin: '0 auto 20px auto', display: 'block' }} />
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              Empire Intelligence
            </h1>
            <p style={{ color: '#e0e7ff', margin: '0' }}>Multi-Tier Access Portal</p>
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
            <p style={{ margin: '5px 0', fontWeight: '600' }}>Demo Accounts:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
              <p style={{ margin: '0', padding: '5px', background: 'rgba(220, 38, 38, 0.3)', borderRadius: '5px' }}>
                👑 owner@empire.core
              </p>
              <p style={{ margin: '0', padding: '5px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '5px' }}>
                ⚡ manager@empire.core
              </p>
              <p style={{ margin: '0', padding: '5px', background: 'rgba(16, 185, 129, 0.3)', borderRadius: '5px' }}>
                👤 team@empire.core
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div style={{
              background: getRoleColor(userRole),
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {getRoleBadge(userRole)}
            </div>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Welcome, {userAccounts.find(u => u.role === userRole)?.name}
            </span>
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
                {activeModule === 'content' && 'Create and manage content across all empire domains'}
                {activeModule === 'intelligence' && 'Market intelligence and competitor analysis'}
                {activeModule === 'predictions' && 'AI-powered market predictions and forecasts'}
                {activeModule === 'domains' && 'Domain portfolio management and analytics'}
              </p>
            </div>

            {activeModule === 'dashboard' && renderDashboard()}
            {activeModule === 'content' && renderContentSystem()}
            
            {activeModule !== 'dashboard' && activeModule !== 'content' && (
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
