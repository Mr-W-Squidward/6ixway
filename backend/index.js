const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const PORT = process.env.port || 3000;

// Middleware
app.use(cors()); // Cross-origin requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Import authentication functions

const { authenticate, signup } = require('./auth/auth');

// Database Connection
const client = new Client(process.env.DATABASE_URL)

async function startServer() {
  await client.connect();

  // Define a basic route
  app.get('/', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM users');
      res.json(result.rows); // Send all users as JSON
    } catch (err) {
      console.error("Error querying database", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // -- AUTHENTICATION --

  // Signup

  // Login

  // Fetch location

  // Near you

}