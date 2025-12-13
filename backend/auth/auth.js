// Simple in-memory user store

const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL)
client.connect();

function authenticate(username, password) {
  return users.find(user => user.username === username && user.password === password);
}

function signup(username, password) {
  if (users.find(user => user.username === username)) {
    return { success: false, message: "Username already exists" };
  }

  users.push({ username, password });
  return { success: true, message: { username } };
}

module.exports = { authenticate, signup };