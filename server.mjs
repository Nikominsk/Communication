// server.mjs
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();  // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, JS, CSS) from the "public" folder
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.json());

// Example API route for handling chatgpt requests
app.post('/api/chatgpt', async (req, res) => {

    if(req.body == null) {
        res.json(null);
        return;
    }

    const { prompt, secret } = req.body;

   const isMatch = await bcrypt.compare(secret, process.env.HELLO);
    if (!isMatch) {
        return res.status(401).json({ message: "Unauthorized: Invalid secret code." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPEN_AI}`,
        },
        body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        }),
    });
  
    const data = await response.json();
    res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
