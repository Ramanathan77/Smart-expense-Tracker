import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Activity, Sparkles, User, TrendingUp } from 'lucide-react';
import './App.css';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Analysis } from './pages/Analysis';
import { Auth } from './pages/Auth';
import { Account } from './pages/Account';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function NavLinks() {
  const location = useLocation();
  
  return (
    <ul className="nav-links">
      <li>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
      </li>
      <li>
        <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>
          <Wallet size={20} /> Transactions
        </Link>
      </li>
      <li>
        <Link to="/insights" className={location.pathname === '/insights' ? 'active' : ''}>
          <Activity size={20} /> AI Insights
        </Link>
      </li>
      <li>
        <Link to="/analysis" className={location.pathname === '/analysis' ? 'active' : ''}>
          <TrendingUp size={20} /> Analysis
        </Link>
      </li>
      <li>
        <Link to="/account" className={location.pathname === '/account' ? 'active' : ''}>
          <User size={20} /> Account
        </Link>
      </li>
    </ul>
  );
}

function TopBar({ onLogout }) {
  const { currency, setCurrency } = useCurrency();
  let user = { name: 'Guest' };
  try {
    const rawUser = localStorage.getItem('spendora_user');
    if (rawUser && rawUser !== 'undefined') user = JSON.parse(rawUser);
  } catch (e) {
    console.error('Failed to parse user', e);
  }
  
  return (
    <header className="glass-panel topbar">
      <h2>Welcome back, {user?.name || 'Guest'}</h2>
      <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ 
            background: 'var(--glass-bg)', color: 'var(--text-primary)', 
            border: '1px solid var(--glass-border)', padding: '8px 12px', 
            borderRadius: '8px', outline: 'none', cursor: 'pointer' 
          }}
        >
          <option style={{background: 'var(--bg-primary)'}} value="$">USD ($)</option>
          <option style={{background: 'var(--bg-primary)'}} value="€">EUR (€)</option>
          <option style={{background: 'var(--bg-primary)'}} value="£">GBP (£)</option>
          <option style={{background: 'var(--bg-primary)'}} value="₹">INR (₹)</option>
          <option style={{background: 'var(--bg-primary)'}} value="¥">JPY (¥)</option>
        </select>
        <div 
          onClick={onLogout} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
            background: 'rgba(255, 0, 60, 0.1)', color: 'var(--neon-magenta)',
            borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255, 0, 60, 0.3)',
            fontWeight: '500', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 0, 60, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 0, 60, 0.1)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </div>
      </div>
    </header>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('spendora_token'));

  const handleLogout = () => {
    localStorage.removeItem('spendora_token');
    localStorage.removeItem('spendora_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="spendora-app">
        <Auth onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <Router>
        <div className="spendora-app">
          {/* Navigation Sidebar */}
          <nav className="glass-panel sidebar">
            <div className="logo neon-text-cyan">
              <Sparkles size={24} /> Spendora
            </div>
            <NavLinks />
          </nav>
          
          {/* Main Content Area */}
          <main className="main-content">
            <TopBar onLogout={handleLogout} />
            
            <div className="page-wrapper">
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/transactions" element={<ErrorBoundary><Transactions /></ErrorBoundary>} />
               <Route path="/insights" element={<Insights />} />
               <Route path="/analysis" element={<Analysis />} />
               <Route path="/account" element={<Account />} />
             </Routes>
          </div>
        </main>
      </div>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
