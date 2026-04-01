import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Mail, Calendar, Settings, Bell, Shield, LogOut } from 'lucide-react';

export function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const [budget, setBudget] = useState(localStorage.getItem('spendora_budget') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSaveBudget = () => {
    localStorage.setItem('spendora_budget', budget);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  let user = { name: 'Guest User', email: 'guest@spendora.com', id: 'N/A' };
  try {
    const rawUser = localStorage.getItem('spendora_user');
    if (rawUser && rawUser !== 'undefined') user = JSON.parse(rawUser);
  } catch (e) {
    console.error('Failed to parse user', e);
  }

  // Generate a mock join date based on the user ID for realism (or use current date if none)
  const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* Sidebar / Profile Summary */}
      <div style={{ flex: '1 1 300px' }}>
        <Card highlight style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', fontWeight: 'bold', color: 'white',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{user.email}</p>
          
          <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Calendar size={18} style={{ color: 'var(--neon-cyan)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Joined {joinDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={18} style={{ color: 'var(--neon-magenta)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Pro Member</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Account Settings */}
      <div style={{ flex: '2 1 500px' }}>
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1, padding: '16px', background: 'transparent', border: 'none',
                color: activeTab === 'profile' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'profile' ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'all 0.3s'
              }}
            >
              <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Profile details
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              style={{
                flex: 1, padding: '16px', background: 'transparent', border: 'none',
                color: activeTab === 'preferences' ? 'var(--neon-magenta)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'preferences' ? '2px solid var(--neon-magenta)' : '2px solid transparent',
                cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'all 0.3s'
              }}
            >
              <Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Personal Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      readOnly
                      style={{ 
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={user.email} 
                      readOnly
                      style={{ 
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)', fontSize: '16px', outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Monthly Budget Goal</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                    Set a preferred monthly spending limit to receive AI warnings.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input 
                      type="number" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 5000"
                      style={{ 
                        flex: 1, padding: '12px 16px', borderRadius: '12px',
                        background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)', fontSize: '16px', outline: 'none', maxWidth: '300px'
                      }}
                    />
                    <Button variant="primary" onClick={handleSaveBudget}>Save Goal</Button>
                    {saveSuccess && <span style={{ color: 'var(--neon-cyan)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={14}/> Saved!</span>}
                  </div>
                </div>

                <div style={{ paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={20} style={{ color: 'var(--neon-violet)' }}/> Notifications
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--neon-cyan)', width: '18px', height: '18px' }} />
                      <span>Email me weekly spending summaries</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--neon-magenta)', width: '18px', height: '18px' }} />
                      <span>Alert me when nearing budget limits</span>
                    </label>
                  </div>
                </div>

              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
