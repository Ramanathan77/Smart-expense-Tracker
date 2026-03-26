const API_URL = 'http://localhost:5000/api';

async function seedUser() {
  try {
    // 1. Try to register bob
    const user = { name: 'Bob Showcase', email: 'bob@gmail.com', password: 'password123' };
    console.log('Registering user...');
    let token;
    
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (res.ok) {
      const data = await res.json();
      token = data.token;
      console.log('Registered successfully');
    } else {
      console.log('User might already exist. Logging in...');
      res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
      });
      if (!res.ok) throw new Error('Login failed for ' + user.email);
      const data = await res.json();
      token = data.token;
    }

    // 2. Generate random transactions to showcase features properly
    console.log('Generating transactions...');
    const categories = ['Shopping', 'Food', 'Transport', 'Other'];
    const names = [
      { name: 'Grocery Store', cat: 'Shopping', min: 20, max: 150 },
      { name: 'Amazon Order', cat: 'Shopping', min: 15, max: 300 },
      { name: 'Uber Ride', cat: 'Transport', min: 10, max: 40 },
      { name: 'Subway Train', cat: 'Transport', min: 2, max: 20 },
      { name: 'Coffee Shop', cat: 'Food', min: 4, max: 15 },
      { name: 'Restaurant Dinner', cat: 'Food', min: 30, max: 120 },
      { name: 'Netflix Subscription', cat: 'Other', min: 15, max: 15 },
      { name: 'Internet Bill', cat: 'Other', min: 60, max: 80 },
      { name: 'Concert Tickets', cat: 'Other', min: 80, max: 200 }
    ];

    const transactions = [];
    const now = new Date();

    // Generate 35 transactions over the last 30 days
    for (let i = 0; i < 35; i++) {
      const template = names[Math.floor(Math.random() * names.length)];
      const amountStr = (Math.random() * (template.max - template.min) + template.min).toFixed(2);
      let amount = parseFloat(amountStr) * -1; // Expense

      // Add a couple of income sources to make it interesting
      if (i % 8 === 0) {
        transactions.push({
          name: 'Freelance Design',
          category: 'Other',
          amount: 500,
          date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
      if (i === 1) {
        transactions.push({
          name: 'Monthly Salary',
          category: 'Other',
          amount: 4500,
          date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        });
      }

      transactions.push({
        name: template.name,
        category: template.cat,
        amount: amount,
        date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    // Send bulk transactions
    console.log(`Seeding ${transactions.length} transactions...`);
    const bulkRes = await fetch(`${API_URL}/transactions/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ transactions })
    });

    if (bulkRes.ok) {
      console.log('Seed successful!');
    } else {
      console.error('Failed to seed txs:', await bulkRes.text());
    }

  } catch(err) {
    console.error('Error during seed:', err.message);
  }
}

seedUser();
