const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Move Razorpay initialization outside the endpoint function
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY is not set in the environment variables.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Sujal0320',
  database: process.env.DB_NAME || 'research_connect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL database.');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`user_groups\` (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                createdDate VARCHAR(255),
                creator VARCHAR(255) NOT NULL,
                description TEXT,
                avatar VARCHAR(255),
                members JSON,
                applicants JSON,
                memberLimit INT
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255)
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                timestamp VARCHAR(255)
            )
        `);
        
        connection.release();
        console.log('Database tables are ready.');
    } catch (err) {
        console.error('Error setting up the database:', err.message);
        process.exit(1);
    }
})();

app.get('/groups', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user_groups');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/groups', async (req, res) => {
    const { title, createdDate, creator, description, avatar, members, applicants, memberLimit } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO user_groups (title, createdDate, creator, description, avatar, members, applicants, memberLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, createdDate, creator, description, avatar, JSON.stringify(members || []), JSON.stringify(applicants || []), memberLimit]
        );
        res.status(201).json({ id: result.insertId, message: 'Group created successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/groups/:title', async (req, res) => {
    const { description } = req.body;
    try {
        await pool.query(
            `UPDATE user_groups SET description = ? WHERE title = ?`,
            [description, req.params.title]
        );
        res.status(200).json({ message: 'Group updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/groups/:title/apply', async (req, res) => {
    const groupTitle = req.params.title;
    const applicationData = req.body;
    try {
        const [rows] = await pool.query('SELECT applicants FROM user_groups WHERE title = ?', [groupTitle]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        const applicants = JSON.parse(rows[0].applicants || '[]');
        applicants.push(applicationData);
        await pool.query(
            'UPDATE user_groups SET applicants = ? WHERE title = ?',
            [JSON.stringify(applicants), groupTitle]
        );
        res.status(200).json({ message: 'Application submitted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/groups/:title', async (req, res) => {
    try {
        await pool.query(`DELETE FROM user_groups WHERE title = ?`, [req.params.title]);
        res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const timestamp = new Date().toISOString();
    try {
        await pool.query(
            `INSERT INTO messages (name, email, message, timestamp) VALUES (?, ?, ?, ?)`,
            [name, email, message, timestamp]
        );
        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

app.post('/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, password, role]
        );
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        res.status(201).json({ user, message: 'User created successfully.' });
    } catch (err) {
        res.status(400).json({ error: 'User already exists or other error.' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            res.status(200).json({ user, message: 'Login successful.' });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});