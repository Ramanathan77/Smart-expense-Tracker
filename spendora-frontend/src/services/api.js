const API_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('spendora_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw new Error((await res.json()).msg || 'Registration failed');
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error((await res.json()).msg || 'Login failed');
  return res.json();
};

export const getTransactions = async () => {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const addTransaction = async (txData) => {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(txData)
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
};

export const addBulkTransactions = async (transactions) => {
  const res = await fetch(`${API_URL}/transactions/bulk`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ transactions })
  });
  if (!res.ok) throw new Error('Failed to add bulk transactions');
  return res.json();
};

export const getInsights = async () => {
  const res = await fetch(`${API_URL}/insights`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
};

export const chatWithAi = async (query) => {
  const res = await fetch(`${API_URL}/insights/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to process AI chat');
  return res.json();
};

export const deleteTransaction = async (id) => {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.json();
};
