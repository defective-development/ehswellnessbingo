const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// File paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const TEAMS_FILE = path.join(__dirname, 'data', 'teams.json');
const PROMPTS_FILE = path.join(__dirname, 'data', 'prompts.json');
const TEAM_BOARDS_FILE = path.join(__dirname, 'data', 'teamBoards.json');

app.use(express.json());
app.use(express.static('public'));

// Initialize data files if they don't exist
function initializeDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Initialize users.json
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
  }

  // Initialize teams.json
  if (!fs.existsSync(TEAMS_FILE)) {
    const teams = {
      "English Department": {},
      "Math Department": {},
      "History Department": {},
      "Science Department": {},
      "Language Department": {},
      "Art Department": {}
    };
    fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2));
  }

  // Initialize prompts.json
  if (!fs.existsSync(PROMPTS_FILE)) {
    const prompts = {
      "English Department": [
        "Read a poem", "Write in a journal", "Analyze a piece of literature",
        "Practice creative writing", "Discuss a book with someone"
      ],
      "Math Department": [
        "Solve a puzzle", "Play with numbers", "Calculate mental math",
        "Learn a new formula", "Practice geometry"
      ],
      "History Department": [
        "Share a story", "Look up a historical event", "Visit a museum",
        "Read about a historical figure", "Watch a documentary"
      ],
      "Science Department": [
        "Drink water", "Observe something natural", "Conduct a simple experiment",
        "Learn about a scientific concept", "Study the weather"
      ],
      "Language Department": [
        "Learn a new word", "Practice another language", "Study grammar",
        "Practice pronunciation", "Learn about different cultures"
      ],
      "Art Department": [
        "Draw something", "Visit a colorful space", "Create a piece of art",
        "Study art history", "Visit an art gallery"
      ],
      "generic": [
        "Stretch for 5 minutes", "Get 8 hours of sleep", "Help someone today",
        "Drink more water", "Take a walk outside", "Call a friend or family member",
        "Practice deep breathing", "Declutter your workspace", "Learn something new",
        "Give someone a compliment", "Practice gratitude", "Try a new food",
        "Listen to music", "Read for pleasure", "Exercise for 30 minutes",
        "Meditate for 10 minutes", "Write down your goals", "Clean your living space",
        "Connect with nature", "Practice self-care", "Learn a new skill",
        "Volunteer your time", "Cook a healthy meal", "Practice mindfulness",
        "Express creativity"
      ]
    };
    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
  }

  // Initialize teamBoards.json
  if (!fs.existsSync(TEAM_BOARDS_FILE)) {
    fs.writeFileSync(TEAM_BOARDS_FILE, JSON.stringify({}, null, 2));
  }
}

// Load data from files
function loadData() {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const teams = JSON.parse(fs.readFileSync(TEAMS_FILE, 'utf8'));
  const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
  const teamBoards = JSON.parse(fs.readFileSync(TEAM_BOARDS_FILE, 'utf8'));
  return { users, teams, prompts, teamBoards };
}

// Save data to files
function saveData(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data.users, null, 2));
  fs.writeFileSync(TEAMS_FILE, JSON.stringify(data.teams, null, 2));
  fs.writeFileSync(PROMPTS_FILE, JSON.stringify(data.prompts, null, 2));
  fs.writeFileSync(TEAM_BOARDS_FILE, JSON.stringify(data.teamBoards, null, 2));
}

// Utility function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate board for a specific building and team
function generateBoardForBuildingTeam(building, team) {
  const data = loadData();
  const teamPrompts = data.prompts[team] || [];
  const genericPrompts = data.prompts["generic"] || [];
  const allPrompts = [...teamPrompts, ...genericPrompts];
  const shuffled = shuffleArray(allPrompts);
  const board = [];
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      board.push({ text: "FREE", selectedBy: [], isFree: true });
    } else {
      board.push({ text: shuffled[i] || "Generic activity", selectedBy: [], isFree: false });
    }
  }
  return board;
}

const TEAM_SIZE_LIMIT = 4;

function getAvailableGroupName(users, building, team) {
  // Find all group names for this building/team
  const groupNames = Object.values(users)
    .filter(u => u.building === building && u.team.startsWith(team))
    .map(u => u.team);
  // Count members in each group
  const groupCounts = {};
  groupNames.forEach(name => {
    groupCounts[name] = (groupCounts[name] || 0) + 1;
  });
  // Try base group first
  if ((groupCounts[team] || 0) < TEAM_SIZE_LIMIT) return team;
  // Try numbered groups
  let groupNum = 2;
  while (true) {
    const groupName = `${team} Group ${groupNum}`;
    if ((groupCounts[groupName] || 0) < TEAM_SIZE_LIMIT) return groupName;
    groupNum++;
  }
}

// Initialize data files on startup
initializeDataFiles();

// GET /teams - Get available teams
app.get('/teams', (req, res) => {
  const data = loadData();
  res.json(Object.keys(data.teams));
});

// GET /buildings - Get available buildings (mock data)
app.get('/buildings', (req, res) => {
  res.json([
    "Edina High School",
    "South View Middle School", 
    "Valley View Middle School",
    "Other"
  ]);
});

// POST /login - User authentication and building/team board creation
app.post('/login', (req, res) => {
  const { username, password, building, team } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const data = loadData();
  if (data.users[username]) {
    // Existing user: only allow login with correct password, ignore building/team
    if (data.users[username].password !== password) {
      return res.status(403).json({ error: "Incorrect password" });
    }
    // Return their locked building/team
    const userBuilding = data.users[username].building;
    const userTeam = data.users[username].team;
    if (!data.teamBoards[userBuilding]) data.teamBoards[userBuilding] = {};
    if (!data.teamBoards[userBuilding][userTeam]) {
      data.teamBoards[userBuilding][userTeam] = {
        board: generateBoardForBuildingTeam(userBuilding, userTeam),
        lastUpdated: new Date().toISOString()
      };
      saveData(data);
    }
    return res.json({
      board: data.teamBoards[userBuilding][userTeam].board,
      team: userTeam,
      building: userBuilding,
      bingos: data.users[username].bingos || 0
    });
  } else {
    // If building/team are missing, treat as user not found (for two-step login)
    if (!building || !team) {
      return res.status(404).json({ error: "User not found" });
    }
    // Assign to first available group or create new group
    const assignedGroup = getAvailableGroupName(data.users, building, team);
    data.users[username] = { password, team: assignedGroup, building, bingos: 0 };
    if (!data.teamBoards[building]) data.teamBoards[building] = {};
    if (!data.teamBoards[building][assignedGroup]) {
      data.teamBoards[building][assignedGroup] = {
        board: generateBoardForBuildingTeam(building, assignedGroup),
        lastUpdated: new Date().toISOString()
      };
    }
    saveData(data);
    return res.json({
      board: data.teamBoards[building][assignedGroup].board,
      team: assignedGroup,
      building,
      bingos: 0
    });
  }
});

// GET /getTeamBoard - Get current building/team board
app.get('/getTeamBoard', (req, res) => {
  const { building, team } = req.query;
  if (!building || !team) {
    return res.status(400).json({ error: "Building and team parameters are required" });
  }
  const data = loadData();
  if (!data.teamBoards[building] || !data.teamBoards[building][team]) {
    return res.status(404).json({ error: "Board not found" });
  }
  res.json(data.teamBoards[building][team]);
});

// POST /tile - Update tile state for building/team
app.post('/tile', (req, res) => {
  const { username, building, team, row, col, selected } = req.body;
  if (!username || !building || !team || row === undefined || col === undefined || selected === undefined) {
    return res.status(400).json({ error: "Username, building, team, row, col, and selected are required" });
  }
  const data = loadData();
  if (!data.teamBoards[building] || !data.teamBoards[building][team]) {
    return res.status(404).json({ error: "Board not found" });
  }
  const index = row * 5 + col;
  const tile = data.teamBoards[building][team].board[index];
  if (!tile) {
    return res.status(404).json({ error: "Tile not found" });
  }
  if (selected) {
    if (!tile.selectedBy.includes(username)) tile.selectedBy.push(username);
  } else {
    tile.selectedBy = tile.selectedBy.filter(user => user !== username);
  }
  data.teamBoards[building][team].lastUpdated = new Date().toISOString();
  saveData(data);
  res.json({ success: true, tile });
});

// POST /newboard - Generate new board for team
app.post('/newboard', (req, res) => {
  const { team } = req.body;
  
  if (!team) {
    return res.status(400).json({ error: "Team parameter is required" });
  }

  const data = loadData();
  
  data.teamBoards[team] = {
    board: generateBoardForBuildingTeam(data.users[req.body.username].building, team), // Use user's building
    lastUpdated: new Date().toISOString()
  };
  
  saveData(data);
  
  res.json({ board: data.teamBoards[team].board });
});

// POST /updateBingos - Update team bingo count for building
app.post('/updateBingos', (req, res) => {
  const { building, team } = req.body;
  if (!building || !team) {
    return res.status(400).json({ error: "Building and team are required" });
  }
  const data = loadData();
  Object.keys(data.users).forEach(username => {
    const user = data.users[username];
    if (user.team === team && user.building === building) {
      data.users[username].bingos = (data.users[username].bingos || 0) + 1;
    }
  });
  saveData(data);
  res.json({ success: true });
});

// GET /scoreboard - Get team rankings for a building
app.get('/scoreboard', (req, res) => {
  const { building } = req.query;
  if (!building) {
    return res.status(400).json({ error: "Building parameter is required" });
  }
  const data = loadData();
  const teamScores = {};
  Object.keys(data.users).forEach(username => {
    const user = data.users[username];
    if (user.building === building) {
      if (!teamScores[user.team]) {
        teamScores[user.team] = { bingos: 0, members: 0 };
      }
      teamScores[user.team].bingos += user.bingos || 0;
      teamScores[user.team].members += 1;
    }
  });
  const rankings = Object.entries(teamScores)
    .map(([team, data]) => ({ team, ...data }))
    .sort((a, b) => b.bingos - a.bingos);
  res.json(rankings);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Team Bingo server running at http://localhost:${PORT}`);
  console.log(`📁 Data files initialized in ${path.join(__dirname, 'data')}`);
});
