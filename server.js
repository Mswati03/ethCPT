
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key

// Function to negotiate price using OpenAI GPT-4 model
const negotiatePrice = async (description, priceUSD) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',  // GPT model
        messages: [
          {
            role: 'system',
            content: 'You are an expert contract negotiator.'
          },
          {
            role: 'user',
            content: `The contract price is $${priceUSD}. Try to negotiate a better price for this contract: ${description}`
          }
        ],
        temperature: 0.7 // Adjust this to control creativity in negotiation
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse AI response and extract the negotiated price
    const aiResponse = response.data.choices[0].message.content;
    const negotiatedPrice = parseFloat(aiResponse.match(/\$\d+(\.\d+)?/)[0].replace('$', ''));
    return negotiatedPrice;
  } catch (error) {
    console.error('Error negotiating price:', error);	
    return priceUSD; // Fallback to the original price if error occurs
  }
};

// Endpoint for negotiating price
app.post('/negotiate', async (req, res) => {
  const { description, priceUSD } = req.body;

  try {
    const negotiatedPrice = await negotiatePrice(description, priceUSD);
    res.json({ negotiatedPrice });
  } catch (error) {
    res.status(500).json({ error: 'Failed to negotiate price' });
  }
});

// Serve frontend from 'public' folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});