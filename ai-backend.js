// ai-backend.js: Express server for Gemini API integration
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Simple CORS for local development
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});


// Set your Gemini API key here or via env
const GEMINI_API_KEY = 'AIzaSyArHKjiIbVBgBvJyhAnmodPkEaceIxKoJ4';
// Use a valid model name, e.g., gemini-3-flash-preview or gemini-1.5-pro-latest
const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.post('/chat', async (req, res) => {
	const { message } = req.body;
	if (!message) return res.status(400).json({ error: 'No message provided' });
	try {
		const response = await fetch(GEMINI_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{ text: message }
						]
					}
				]
			})
		});
		const data = await response.json();
		console.log('Gemini API response:', JSON.stringify(data, null, 2));
		let aiReply = 'Sorry, no response.';
		if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
			aiReply = data.candidates[0].content.parts[0].text;
		}
		res.json({ reply: aiReply });
	} catch (err) {
		console.error('Gemini request failed:', err);
		res.status(500).json({ error: 'Gemini request failed', details: err.message });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`AI backend running on port ${PORT}`);
});
