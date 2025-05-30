require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { simpleParser } = require('mailparser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: '*/*' }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ Newsletter parser is up and running!');
});

// Parse raw email
app.post('/parse', async (req, res) => {
  try {
    const parsed = await simpleParser(req.body);
    const jsonOutput = {
      sender: parsed.from?.text || '',
      subject: parsed.subject || '',
      body: parsed.text || ''
    };
    res.json(jsonOutput);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse email', details: error.message });
  }
});

// Receive structured JSON email
app.post('/email', (req, res) => {
  const { sender, subject, body } = req.body;
  if (!sender || !subject || !body) {
    return res.status(400).json({ error: 'Missing sender, subject, or body' });
  }
  console.log('📥 Email received:', { sender, subject, body });
  res.json({ message: 'Email received successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Newsletter parser running on port ${PORT}`));
