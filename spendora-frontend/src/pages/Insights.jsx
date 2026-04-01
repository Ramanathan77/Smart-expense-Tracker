import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Sparkles, Send, User, Bot, AlertCircle } from 'lucide-react';
import { chatWithAi } from '../services/api';

export function Insights() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Hello! I am your Spendora AI financial assistant. Ask me anything about your spending, budgets, or get a quick analysis of your recent transactions!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAi(userMessage.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'error', text: 'Failed to connect to AI: ' + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Sparkles className="neon-text-cyan" size={32} />
        <h1 style={{ margin: 0 }}>Ask Spendora AI</h1>
      </div>
      
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.role !== 'user' && (
                <div style={{ padding: '8px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px', height: 'fit-content' }}>
                  {msg.role === 'error' ? <AlertCircle size={24} className="neon-text-magenta" /> : <Bot size={24} className="neon-text-cyan" />}
                </div>
              )}
              
              <div style={{
                background: msg.role === 'user' ? 'var(--neon-violet)' : 'var(--bg-secondary)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                padding: '16px 20px',
                borderRadius: '16px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role !== 'user' ? '4px' : '16px',
                border: msg.role !== 'user' ? '1px solid var(--glass-border)' : 'none',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(138, 43, 226, 0.3)' : 'none',
                lineHeight: '1.6'
              }}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px', height: 'fit-content' }}>
                 <Bot size={24} className="neon-text-cyan" />
              </div>
              <div style={{ padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., Analyze my spending this month..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '16px 20px',
                borderRadius: '24px',
                outline: 'none',
                fontSize: '16px'
              }}
            />
            <Button type="submit" variant="primary" style={{ borderRadius: '24px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isLoading || !input.trim()}>
              <Send size={18} /> Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
