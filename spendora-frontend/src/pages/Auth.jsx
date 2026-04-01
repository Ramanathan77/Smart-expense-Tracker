import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Sparkles, Mail, Lock, User, LayoutDashboard, Zap, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('spendora_token', data.token);
        localStorage.setItem('spendora_user', JSON.stringify(data.user));
        onLogin();
      } else {
        const data = await registerUser(formData);
        localStorage.setItem('spendora_token', data.token);
        localStorage.setItem('spendora_user', JSON.stringify(data.user));
        onLogin();
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please ensure XAMPP MySQL and the backend server are running.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-primary)', flexWrap: 'wrap' }}>
      
      {/* Left Info Section */}
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', padding: '64px', justifyContent: 'center', background: 'rgba(14, 165, 233, 0.05)', borderRight: '1px solid var(--glass-border)' }}>
        <div className="logo neon-text-cyan" style={{ fontSize: '42px', marginBottom: '24px' }}>
          <Sparkles size={42} /> Spendora
        </div>
        <h1 style={{ fontSize: '48px', marginBottom: '24px', lineHeight: 1.2 }}>
          Master Your Finances <br/>with AI Precision
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '500px', marginBottom: '48px', lineHeight: 1.6 }}>
          A futuristic financial companion that automatically categorizes transactions, tracks smart budgets, and provides AI insights.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px', color: 'var(--neon-cyan)' }}>
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Smart Dashboard</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Track your daily spending and balances at a glance.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 0, 60, 0.1)', borderRadius: '12px', color: 'var(--neon-magenta)' }}>
              <Zap size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>AI-Powered Insights</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Get actionable advice to cut down wastage and save more.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '12px', color: 'var(--neon-violet)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Bank-grade Security</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Your financial data is completely encrypted and secured.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Login Section */}
      <div style={{ flex: '1 1 400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <Card highlight style={{ width: '100%', maxWidth: '450px', padding: '48px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '32px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {isLogin ? 'Enter your details to access your dashboard.' : 'Start tracking your expenses like a pro.'}
        </p>

        {error && <p style={{ color: 'var(--neon-magenta)', textAlign: 'center', margin: '0 0 16px 0', background: 'rgba(255,0,60,0.1)', padding: '12px', borderRadius: '8px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
              <input 
                type="text"
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name" 
                required
                style={{ 
                  width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
                }}
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address" 
              required
              style={{ 
                width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              required
              style={{ 
                width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
              }}
            />
          </div>

          <Button type="submit" variant="primary" style={{ marginTop: '12px', padding: '14px', fontSize: '16px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)', fontSize: '15px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => {setIsLogin(!isLogin); setError('');}} 
            style={{ color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: '500' }}
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </span>
        </div>
      </Card>
      </div>
    </div>
  );
}
