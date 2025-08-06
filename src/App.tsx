import React, { useState, useEffect } from 'react';
import { Brain, Database, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, Zap, BarChart3, Settings, Eye, Shield, Globe, Users, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sample data for demonstration
  const [stats] = useState({
    totalRevenue: 272000,
    activeModules: 4,
    domainsTracked: 5,
    uptime: 99.999,
    predictionsAccuracy: 94.7,
    competitorsTracked: 847,
    opportunitiesValue: 4700000
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in production, use proper authentication
    if (loginEmail === 'empire@admin.core' || loginEmail === 'partner@empire.com') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Try: empire@admin.core');
    }
  };

  const modules = [
    { id: 'dashboard', name: 'Command Center', icon: Brain, color: 'bg-purple-600' },
    { id: 'intelligence', name: 'Market Intelligence', icon: Eye, color: 'bg-blue-600' },
    { id: 'predictions', name: 'Prediction Engine', icon: TrendingUp, color: 'bg-green-600' },
    { id: 'domains', name: 'Empire Domains', icon: Globe, color: 'bg-orange-600' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-96 border border-white/20">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Empire Intelligence</h1>
            <p className="text-purple-200">Secure Access Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Access Empire
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-purple-200">
            <p>Demo Credentials:</p>
            <p>empire@admin.core</p>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Modules</p>
              <p className="text-2xl font-bold">{stats.activeModules}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">System Uptime</p>
              <p className="text-2xl font-bold">{stats.uptime}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Prediction Accuracy</p>
              <p className="text-2xl font-bold">{stats.predictionsAccuracy}%</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Revenue Intelligence
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Domain Portfolio</span>
              <span className="font-semibold text-green-600">+${(stats.totalRevenue * 0.3).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Affiliate Network</span>
              <span className="font-semibold text-blue-600">+${(stats.totalRevenue * 0.45).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Intelligence Services</span>
              <span className="font-semibold text-purple-600">+${(stats.totalRevenue * 0.25).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-600" />
            Market Intelligence
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Competitors Tracked</span>
              <span className="font-semibold">{stats.competitorsTracked}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Market Opportunities</span>
              <span className="font-semibold text-green-600">${(stats.opportunitiesValue / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Active Domains</span>
              <span className="font-semibold">{stats.domainsTracked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Empire Intelligence System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Empire Admin</span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl shadow-lg p-6">
            <nav className="space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeModule === module.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {module.name}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {modules.find(m => m.id === activeModule)?.name || 'Dashboard'}
              </h2>
              <p className="text-gray-600">
                {activeModule === 'dashboard' && 'Complete overview of your empire operations'}
                {activeModule === 'intelligence' && 'Market intelligence and competitor analysis'}
                {activeModule === 'predictions' && 'AI-powered market predictions and forecasts'}
                {activeModule === 'domains' && 'Domain portfolio management and analytics'}
              </p>
            </div>

            {activeModule === 'dashboard' && renderDashboard()}
            
            {activeModule !== 'dashboard' && (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(modules.find(m => m.id === activeModule)?.icon || Brain, {
                    className: "w-8 h-8 text-purple-600"
                  })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {modules.find(m => m.id === activeModule)?.name} Module
                </h3>
                <p className="text-gray-600 mb-6">
                  This module is ready for development. Add your specific functionality here.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
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
