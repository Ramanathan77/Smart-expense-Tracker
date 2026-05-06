import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCurrency } from '../context/CurrencyContext';
import { getTransactions, getInsights } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [spent, setSpent] = useState(0);
  const [insight, setInsight] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [badges, setBadges] = useState([]);
  
  const budget = parseFloat(localStorage.getItem('spendora_budget')) || 0;
  const budgetPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOverBudget = spent > budget && budget > 0;

  useEffect(() => {
    async function fetchData() {
      try {
        const txs = await getTransactions();
        let bal = 0; let sp = 0;
        const catTotals = {};

        const tMap = {};
        for(let i=29; i>=0; i--) {
           const d = new Date();
           d.setDate(d.getDate() - i);
           const key = `${d.getMonth()+1}/${d.getDate()}`;
           tMap[key] = { date: key, spent: 0, income: 0 };
        }

        if (Array.isArray(txs)) {
          txs.forEach(t => {
            const amt = parseFloat(t.amount);
            bal += amt;
            
            const d = new Date(t.date);
            const key = `${d.getMonth()+1}/${d.getDate()}`;
            if(tMap[key]) {
               if(amt < 0) tMap[key].spent += Math.abs(amt);
               else tMap[key].income += amt;
            }

            if (amt < 0) {
              const absAmt = Math.abs(amt);
              sp += absAmt;
              catTotals[t.category] = (catTotals[t.category] || 0) + absAmt;
            }
          });
        }
        
        const catChartData = Object.keys(catTotals).map(key => ({
          name: key,
          value: catTotals[key]
        }));
        
        let highestCat = ''; let maxAmt = 0;
        for (const [cat, amount] of Object.entries(catTotals)) {
           if(amount > maxAmt) { maxAmt = amount; highestCat = cat; }
        }

        const earnedBadges = [];
        if (txs.length > 0) earnedBadges.push({ icon: '🌟', name: 'Starter', desc: 'Added first transaction' });
        if (txs.length >= 10) earnedBadges.push({ icon: '🔥', name: 'Active Tracker', desc: 'Over 10 transactions' });
        if (budget > 0 && sp < budget) earnedBadges.push({ icon: '👑', name: 'Saver Pro', desc: 'Under budget limit' });
        if (highestCat === 'Food') earnedBadges.push({ icon: '🍔', name: 'Foodie', desc: 'Top spend: Food' });
        if (highestCat === 'Shopping') earnedBadges.push({ icon: '🛍️', name: 'Shopper', desc: 'Top spend: Shopping' });
        if (highestCat === 'Transport') earnedBadges.push({ icon: '🚗', name: 'Traveler', desc: 'Top spend: Transport' });

        setBadges(earnedBadges);
        setTrendData(Object.values(tMap));
        setCategoryData(catChartData);
        setBalance(bal);
        setSpent(sp);

        const ins = await getInsights();
        if (ins.length > 0) setInsight(ins[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const COLORS = ['#00f0ff', '#ff003c', '#8a2be2', '#00ff88', '#ffaa00'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Track your daily spending and insights.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/transactions')}>+ Add Transaction</Button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <Card>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Total Balance</span>
            <Wallet size={20} className="neon-text-violet" />
          </div>
          <h2 style={{ fontSize: '36px', margin: '16px 0 8px 0', fontWeight: '500' }}>{currency}{balance.toFixed(2)}</h2>
          <div className="stat-trend" style={{ color: '#00ff88', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <ArrowUpRight size={16} /> <span style={{color: 'var(--text-secondary)'}}>Last 30 days</span>
          </div>
        </Card>
        
        <Card>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Total Spending</span>
            <DollarSign size={20} className="neon-text-magenta" />
          </div>
          <h2 style={{ fontSize: '36px', margin: '16px 0 8px 0', fontWeight: '500' }}>{currency}{spent.toFixed(2)}</h2>
          <div className="stat-trend" style={{ color: 'var(--neon-magenta)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <ArrowDownRight size={16} /> <span style={{color: 'var(--text-secondary)'}}>Last 30 days</span>
          </div>
        </Card>

        {insight && (
          <Card highlight>
            <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>AI Spotlight</span>
              <span className="neon-text-cyan" style={{ fontSize: '20px' }}>✨</span>
            </div>
            <p style={{ margin: '16px 0 0 0', lineHeight: '1.6', fontSize: '15px' }}>
              <strong className="neon-text-magenta">{insight.title}</strong>: {insight.description}
            </p>
          </Card>
        )}
      </div>

      {badges.length > 0 && (
        <Card style={{ marginBottom: '24px', background: 'rgba(138, 43, 226, 0.05)', border: '1px solid var(--neon-violet)' }}>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-violet)' }}>
            Smart Badges Achieved
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {badges.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', flex: '1 1 auto', minWidth: '150px' }}>
                <span style={{ fontSize: '24px' }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="charts-area">
        {budget > 0 && (
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} className="neon-text-cyan" /> Monthly Budget Goal
              </h3>
              <span style={{ color: isOverBudget ? 'var(--neon-magenta)' : 'var(--text-secondary)' }}>
                {currency}{spent.toFixed(2)} / {currency}{budget.toFixed(2)}
              </span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${budgetPercent}%`, 
                background: isOverBudget ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
                transition: 'width 0.5s ease-out',
                boxShadow: isOverBudget ? '0 0 10px var(--neon-magenta)' : '0 0 10px var(--neon-cyan)'
              }}></div>
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          <Card className="chart-card">
            <h3 style={{ marginBottom: '24px', fontWeight: '500' }}>30-Day Spending Trend</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-magenta)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--neon-magenta)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${currency}${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="spent" name="Spent" stroke="var(--neon-magenta)" fillOpacity={1} fill="url(#colorSpent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="var(--neon-cyan)" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="chart-card">
            <h3 style={{ marginBottom: '24px', fontWeight: '500' }}>Spending by Category</h3>
            <div style={{ width: '100%', height: '300px' }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      formatter={(value) => `${currency}${value.toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '100px' }}>No spending data yet.</div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
