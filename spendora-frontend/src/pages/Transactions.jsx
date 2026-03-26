import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DollarSign, ShoppingBag, Coffee, Car, Upload, Download, Trash2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { getTransactions, addTransaction, addBulkTransactions, deleteTransaction } from '../services/api';

const icons = {
  Shopping: <ShoppingBag size={20} className="neon-text-cyan" />,
  Food: <Coffee size={20} className="neon-text-magenta" />,
  Transport: <Car size={20} className="neon-text-violet" />,
  Other: <DollarSign size={20} />
};

export function Transactions() {
  const { currency } = useCurrency();
  const fileInputRef = React.useRef();
  const [transactions, setTransactions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ type: 'expense', name: '', category: 'Food', amount: '', walletType: 'Cash', date: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadTxs = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      loadTxs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTxs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let finalAmount = Math.abs(parseFloat(formData.amount));
      if (formData.type === 'expense') finalAmount = -finalAmount;

      await addTransaction({
        name: formData.name,
        category: formData.category,
        amount: finalAmount,
        walletType: formData.walletType,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
      });
      setShowAdd(false);
      setFormData({ type: 'expense', name: '', category: 'Food', amount: '', walletType: 'Cash', date: '' });
      loadTxs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n');
        const newTxs = [];
        // Format expected: Date,Name,Category,Amount
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const parts = line.split(',');
          if (parts.length >= 4) {
             const [date, name, category, amount] = parts;
             newTxs.push({
               date: new Date(date),
               name: name.trim(),
               category: category.trim() || 'Other',
               amount: parseFloat(amount)
             });
          }
        }
        if (newTxs.length > 0) {
          await addBulkTransactions(newTxs);
          loadTxs();
        }
      } catch (err) {
        console.error('Parsing CSS error:', err);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = null;
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,Name,Category,Amount,Date\n";
    
    transactions.forEach(tx => {
      const name = `"${tx.name.replace(/"/g, '""')}"`;
      const category = `"${tx.category.replace(/"/g, '""')}"`;
      const amount = tx.amount;
      const date = new Date(tx.date).toLocaleDateString();
      csvContent += `${name},${category},${amount},${date}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `spendora_transactions_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    txDate.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparisons

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (txDate.getTime() < start.getTime()) return false;
    }
    
    if (endDate) {
       const end = new Date(endDate);
       end.setHours(23, 59, 59, 999);
       if (txDate.getTime() > end.getTime()) return false;
    }
    return true;
  });

  return (
    <div className="transactions-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ margin: 0 }}>Transactions</h1>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <span style={{color: 'var(--text-secondary)', fontSize: '14px'}}>From:</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark' }} />
            <span style={{color: 'var(--text-secondary)', fontSize: '14px'}}>To:</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark' }} />
          </div>
          <Button variant="outline" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </Button>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <Button variant="secondary" onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} /> Upload CSV
          </Button>
          <Button onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add Receipt'}</Button>
        </div>
      </div>

      {showAdd && (
        <Card highlight style={{ marginBottom: '24px' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ minWidth: '120px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}>
              <option value="expense" style={{background: 'var(--bg-primary)'}}>Expense</option>
              <option value="income" style={{background: 'var(--bg-primary)'}}>Income</option>
            </select>
            <input type="text" placeholder="Title" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ flex: 1, minWidth: '200px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }} />
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ minWidth: '130px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}>
              <option value="Shopping" style={{background: 'var(--bg-primary)'}}>Shopping</option>
              <option value="Food" style={{background: 'var(--bg-primary)'}}>Food</option>
              <option value="Transport" style={{background: 'var(--bg-primary)'}}>Transport</option>
              <option value="Other" style={{background: 'var(--bg-primary)'}}>Other</option>
            </select>
            <select value={formData.walletType} onChange={e => setFormData({...formData, walletType: e.target.value})} style={{ minWidth: '130px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}>
              <option value="Cash" style={{background: 'var(--bg-primary)'}}>Cash</option>
              <option value="Credit Card" style={{background: 'var(--bg-primary)'}}>Credit Card</option>
              <option value="Bank Account" style={{background: 'var(--bg-primary)'}}>Bank</option>
            </select>
            <input type="number" step="0.01" min="0" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ minWidth: '110px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }} />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ minWidth: '130px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', colorScheme: 'dark' }} />
            <Button type="submit" variant="primary">Save</Button>
          </form>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
               <th style={{ padding: '16px 24px' }}>Transaction</th>
               <th style={{ padding: '16px 24px' }}>Category</th>
               <th style={{ padding: '16px 24px' }}>Wallet</th>
               <th style={{ padding: '16px 24px' }}>Date</th>
               <th style={{ padding: '16px 24px', textAlign: 'right' }}>Amount</th>
               <th style={{ padding: '16px 24px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => {
              const amt = parseFloat(tx.amount);
              return (
              <tr key={tx.id || tx._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    {icons[tx.category] || icons['Other']}
                  </div>
                  <strong style={{ fontSize: '16px' }}>{tx.name}</strong>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{tx.category}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '12px' }}>
                    {tx.walletType || 'Cash'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: amt > 0 ? '#00ff88' : 'white' }}>
                  {amt > 0 ? '+' : ''}{amt < 0 ? '-' : ''}{currency}{Math.abs(amt).toFixed(2)}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <Button variant="outline" onClick={() => handleDelete(tx.id || tx._id)} style={{ padding: '8px', borderColor: 'rgba(255,0,60,0.3)', color: 'var(--neon-magenta)', display: 'flex', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
