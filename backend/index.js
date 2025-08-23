const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const Razorpay = require('razorpay');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
});

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY is not set in the environment variables.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const db = new sqlite3.Database('./research.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to the research database.');

    db.run(`CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        createdDate TEXT,
        creator TEXT NOT NULL,
        description TEXT,
        avatar TEXT,
        members TEXT,
        applicants TEXT,
        memberLimit INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT
    )`);
});

app.get('/groups', (req, res) => {
    db.all('SELECT * FROM groups', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const groups = rows.map(row => ({
            ...row,
            members: JSON.parse(row.members || '[]'),
            applicants: JSON.parse(row.applicants || '[]')
        }));
        res.json(groups);
    });
});

app.post('/groups', (req, res) => {
    const { title, createdDate, creator, description, avatar, members, applicants, memberLimit } = req.body;
    const membersString = JSON.stringify(members);
    const applicantsString = JSON.stringify(applicants);
    
    db.run(
        `INSERT INTO groups (title, createdDate, creator, description, avatar, members, applicants, memberLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, createdDate, creator, description, avatar, membersString, applicantsString, memberLimit],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, message: 'Group created successfully.' });
        }
    );
});

app.put('/groups/:title', (req, res) => {
    const { description } = req.body;
    db.run(
        `UPDATE groups SET description = ? WHERE title = ?`,
        [description, req.params.title],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ message: 'Group updated successfully.' });
        }
    );
});

app.put('/groups/:title/apply', (req, res) => {
    const groupTitle = req.params.title;
    const applicationData = req.body;
    db.get('SELECT applicants FROM groups WHERE title = ?', [groupTitle], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Group not found.' });
            return;
        }
        const applicants = JSON.parse(row.applicants);
        applicants.push(applicationData);
        const updatedApplicantsString = JSON.stringify(applicants);
        db.run(
            'UPDATE groups SET applicants = ? WHERE title = ?',
            [updatedApplicantsString, groupTitle],
            function(updateErr) {
                if (updateErr) {
                    res.status(500).json({ error: updateErr.message });
                    return;
                }
                res.status(200).json({ message: 'Application submitted successfully.' });
            }
        );
    });
});

app.delete('/groups/:title', (req, res) => {
    const groupTitle = req.params.title;
    db.run(`DELETE FROM groups WHERE title = ?`, [groupTitle], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Group deleted successfully.' });
    });
});

app.post('/payments/order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "receipt_order_1",
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const timestamp = new Date().toISOString();
    
    db.run(
        `INSERT INTO messages (name, email, message, timestamp) VALUES (?, ?, ?, ?)`,
        [name, email, message, timestamp],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID, message: 'Message sent successfully.' });
        }
    );
});

app.post('/ai/summarize', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required for summarization.' });
    }
    try {
        const prompt = `Summarize the following research text concisely, focusing on key findings and conclusions: ${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        res.json({ summary });
    } catch (error) {
        console.error('AI summarization error:', error.message);
        res.status(500).json({ error: 'Failed to generate summary.' });
    }
});

app.post('/ai/title-generate', async (req, res) => {
    const { keywords, description } = req.body;
    if (!keywords || !description) {
        return res.status(400).json({ error: 'Keywords and description are required.' });
    }
    try {
        const prompt = `Generate a creative paper title and a concise, 1-paragraph abstract for a research paper based on the following keywords and description. Do not include any extra sentences or conversational filler.
        Keywords: ${keywords}
        Description: ${description}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ text });
    } catch (error) {
        console.error('AI title generation error:', error.message);
        res.status(500).json({ error: 'Failed to generate title and abstract.' });
    }
});

app.post('/auth/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, password, role],
        function(err) {
            if (err) {
                res.status(400).json({ error: 'User already exists or other error.' });
                return;
            }
            const user = { id: this.lastID, name, email, role };
            res.status(201).json({ user, message: 'User created successfully.' });
        }
    );
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            const { password, ...user } = row;
            res.status(200).json({ user, message: 'Login successful.' });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    });
});
app.get("/", (req, res) => {
    res.send("✅ Research Portal Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});