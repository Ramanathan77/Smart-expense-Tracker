import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Sparkles, TrendingDown, Target, Zap } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { getInsights } from '../services/api';

const getIcon = (type) => {
  if (type === 'subscription') return <TrendingDown size={32} />;
  if (type === 'dining') return <Target size={32} />;
  return <Zap size={32} />;
}

export function Insights() {
  const { currency } = useCurrency();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const data = await getInsights();
        setInsights(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchInsights();
  }, []);

  return (
    <div className="insights-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Sparkles className="neon-text-cyan" size={32} />
        <h1 style={{ margin: 0 }}>AI Spending Insights</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 800px)', gap: '24px' }}>
        {insights.map(insight => (
          <Card key={insight.id} highlight style={{ borderColor: insight.color, borderLeftWidth: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
              <div style={{ padding: '16px', background: `${insight.color.replace(')', ', 0.1)').replace('var(--', 'rgba(0,0,0,')}`, borderRadius: '16px', color: insight.color }}>
                {getIcon(insight.type)}
              </div>
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '22px' }}>{insight.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '16px', margin: 0 }}>
                  {insight.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {insights.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>Loading intelligent insights based on your spending patterns...</p>
        )}
      </div>
    </div>
  );
}
