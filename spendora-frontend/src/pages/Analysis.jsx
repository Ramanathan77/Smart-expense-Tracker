import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart2 } from 'lucide-react';
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
    const dailyData = {};

    txs.forEach(t => {
      const amt = parseFloat(t.amount);
      const dateStr = new Date(t.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'});

      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, income: 0, expense: 0, timestamp: new Date(t.date).getTime() };
      }

      if (amt > 0) {
        income += amt;
        dailyData[dateStr].income += amt;
      } else {
        const absAmt = Math.abs(amt);
        expense += absAmt;
        dailyData[dateStr].expense += absAmt;
        catTotals[t.category] = (catTotals[t.category] || 0) + absAmt;
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

    // Count just the days with expenses for average
    let expenseDays = 0;
    Object.values(dailyData).forEach(d => { if (d.expense > 0) expenseDays++; });
    const avgDaily = expenseDays > 0 ? (expense / expenseDays) : 0;

    const sortedChartData = Object.values(dailyData)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({ date: item.date, income: item.income, expense: item.expense }));

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '500' }}>
            <BarChart2 className="neon-text-cyan" /> Income vs. Expense Flow
          </h3>
        </div>
        
        <div style={{ width: '100%', height: '350px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `${currency}${value}`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="var(--neon-cyan)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="var(--neon-magenta)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
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
