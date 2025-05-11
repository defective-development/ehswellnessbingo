const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static('public'));

// Load or initialize users.json
let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// 🔧 Utility to generate a new board of 24 shuffled phrases
function generateBoard() {
  const phrases = [
    "Turn off all technology 30 minutes prior to bedtime (lights out)",
    "Stretch for 10+ minutes",
    "Create a list of short term goals",
    "Declutter your desk or workspace",
    "Call or message someone just because",
    "Write 5 things you are grateful for",
    "Increased water intake",
    "Plan your dinners for the week ahead",
    "Unsubscribe from unnecessary emails",
    "Exercise for 3 days in a row",
    "Check in with a neighbor",
    "Try a deep breathing exercise",
    "Do a random act of kindness",
    "Call a family member you rarely talk to",
    "Donate to a local food pantry",
    "Rest or take a nap",
    "Learn a new skill",
    "Finish reading a book",
    "Give someone a compliment",
    "Declutter space",
    "Make yourself laugh",
    "Go for a nature walk",
    "Go to bed early",
    "Spend a day in the park",
    "Cook a new meal"
  ];

  const shuffled = phrases.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 24);
}

// 🟢 POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  if (!users[username]) {
    const board = generateBoard();
    users[username] = { password, board, crossed: [] };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return res.json({ board, crossed: [] });
  }

  if (users[username].password !== password) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  return res.json({
    board: users[username].board,
    crossed: users[username].crossed || []
  });
});

// 🟢 POST /save
app.post('/save', (req, res) => {
  const { username, crossed } = req.body;
  if (!users[username]) return res.status(404).json({ error: "User not found" });

  users[username].crossed = crossed;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.sendStatus(200);
});

// 🟢 POST /newboard
app.post('/newboard', (req, res) => {
  const { username } = req.body;
  if (!users[username]) return res.status(404).json({ error: "User not found" });

  const newBoard = generateBoard();
  users[username].board = newBoard;
  users[username].crossed = [];
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ board: newBoard });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Bingo server running at http://localhost:${PORT}`);
});
