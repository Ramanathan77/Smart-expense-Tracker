import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { getTransactions } from '../services/api';

export function Analysis() {
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netCashflow: 0,
    topCategory: '',
    avgDailySpend: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTransactions();
        if (Array.isArray(data)) {
          setTransactions(data);
          analyzeData(data);
        }
      } catch (err) {
        console.error('Failed to load transactions for analysis', err);
      }
    }
    fetchData();
  }, []);

  const analyzeData = (txs) => {
    let income = 0;
    let expense = 0;
    const catTotals = {};
    const dailySpendMap = {};

    txs.forEach(t => {
      const amt = parseFloat(t.amount);
      const dateStr = new Date(t.date).toLocaleDateString();

      if (amt > 0) {
        income += amt;
      } else {
        const absAmt = Math.abs(amt);
        expense += absAmt;
        
        // Category grouping
        catTotals[t.category] = (catTotals[t.category] || 0) + absAmt;
        
        // Daily grouping
        dailySpendMap[dateStr] = (dailySpendMap[dateStr] || 0) + absAmt;
      }
    });

    let topCat = 'None';
    let maxSpend = 0;
    Object.keys(catTotals).forEach(cat => {
      if (catTotals[cat] > maxSpend) {
        maxSpend = catTotals[cat];
        topCat = cat;
      }
    });

    const uniqueDays = Object.keys(dailySpendMap).length;
    const avgDaily = uniqueDays > 0 ? (expense / uniqueDays) : 0;

    // Build Chart Data sorted chronologically
    const sortedChartData = Object.keys(dailySpendMap)
      .map(date => ({
        date,
        amount: dailySpendMap[date],
        timestamp: new Date(date).getTime()
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({ date: item.date, amount: item.amount }));

    setChartData(sortedChartData);
    setInsights({
      totalIncome: income,
      totalExpense: expense,
      netCashflow: income - expense,
      topCategory: topCat,
      avgDailySpend: avgDaily
    });
  };

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={28} className="neon-text-cyan" /> Advanced Analysis
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Deeper financial insights drawn from your historical spending.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span>Net Cashflow</span>
            <DollarSign size={20} className={insights.netCashflow >= 0 ? "neon-text-cyan" : "neon-text-magenta"} />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0, color: insights.netCashflow >= 0 ? '#10b981' : 'var(--text-primary)' }}>
            {insights.netCashflow >= 0 ? '+' : '-'}{currency}{Math.abs(insights.netCashflow).toFixed(2)}
          </h2>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span>Top Cost Center</span>
            <TrendingUp size={20} className="neon-text-magenta" />
          </div>
          <h2 style={{ fontSize: '28px', margin: 0 }}>
            {insights.topCategory}
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Highest grossing expense category</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span>Avg Daily Spend</span>
            <TrendingDown size={20} className="neon-text-violet" />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0 }}>
            {currency}{insights.avgDailySpend.toFixed(2)}
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Based on active transaction days</p>
        </Card>
      </div>

      <Card>
        <h3 style={{ marginBottom: '24px', fontWeight: '500' }}>Daily Spending Trajectory</h3>
        <div style={{ width: '100%', height: '350px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `${currency}${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => [`${currency}${parseFloat(value).toFixed(2)}`, 'Spent']}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--neon-cyan)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
              No sufficient data to visualize. Add expenses to track trajectory!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
