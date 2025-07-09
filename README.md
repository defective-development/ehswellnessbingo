# 🎯 Team Wellness Bingo App

A collaborative, real-time bingo application designed for teams to work together on wellness activities. Each team gets their own unique board with department-specific prompts, and all team members can see and interact with the same board in real-time.

## ✨ Features

### 🏢 Team-Based System
- **6 Department Teams**: English, Math, History, Science, Language, and Art
- **Building Selection**: Choose from multiple campus buildings
- **Team-Specific Prompts**: Each department gets unique, relevant activities
- **Shared Boards**: All team members see the same board simultaneously

### 🔄 Real-Time Collaboration
- **Live Syncing**: Board updates every 10 seconds automatically
- **User Tracking**: See who crossed off each activity
- **Visual Indicators**: Hover over crossed tiles to see who completed them
- **Sync Status**: Green pulsing indicator shows live connection

### 🎮 Game Features
- **5x5 Bingo Grid**: Classic bingo layout with FREE center square
- **Team-Specific Activities**: Prompts tailored to each department's focus
- **BINGO Detection**: Automatic detection of winning lines (rows, columns, diagonals)
- **Confetti Celebration**: Colorful celebration when BINGO is achieved
- **Score Tracking**: Team bingo counts and member statistics

### 📊 Competitive Elements
- **Live Scoreboard**: Real-time team rankings with medals (🥇🥈🥉)
- **Team Statistics**: Track bingos and member counts
- **Auto-refresh**: Scoreboard updates every 30 seconds

### 🛠️ Utility Features
- **PDF Export**: Save your board as a printable document
- **New Board Generation**: Create fresh boards for your team
- **Progress Persistence**: All data saved automatically
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser to `http://localhost:3000`

## 🎯 How to Play

### 1. Login
- Enter your username and password
- Select your building from the dropdown
- Choose your department team
- Click "Login" to start

### 2. Team Board
- View your team's shared 5x5 bingo board
- Each tile contains a wellness activity relevant to your department
- The center square is always "FREE"

### 3. Collaboration
- Click any tile to mark it as completed
- See who completed each activity (hover over crossed tiles)
- Watch the board update in real-time as teammates make progress
- Green sync indicator shows the board is live

### 4. Winning
- Complete a full row, column, or diagonal to get BINGO
- Click "Check for BINGO" to verify your win
- Enjoy the confetti celebration!
- Your team's bingo count increases automatically

### 5. Additional Features
- **New Board**: Generate a fresh board for your team
- **Export PDF**: Save your current board as a printable document
- **Scoreboard**: View team rankings and statistics

## 📁 Project Structure

```
bingo-main/
├── data/                    # Data storage
│   ├── users.json          # User accounts and team assignments
│   ├── teams.json          # Team definitions
│   ├── prompts.json        # Team-specific activity prompts
│   └── teamBoards.json     # Shared boards for each team
├── public/                 # Frontend files
│   ├── index.html          # Main game interface
│   └── scoreboard.html     # Team rankings page
├── server.js               # Express server with all API endpoints
├── package.json            # Project configuration
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication & Teams
- `GET /teams` - Get available teams
- `GET /buildings` - Get available buildings
- `POST /login` - User authentication and team board creation

### Board Management
- `GET /getTeamBoard?team=XYZ` - Get current team board
- `POST /tile` - Update tile state (cross/uncross)
- `POST /newboard` - Generate new board for team

### Scoring & Statistics
- `POST /updateBingos` - Update team bingo count
- `GET /scoreboard` - Get team rankings

## 🎨 Team-Specific Prompts

Each department gets unique, relevant activities:

- **English Department**: Reading, writing, literature analysis
- **Math Department**: Puzzles, calculations, problem-solving
- **History Department**: Research, storytelling, cultural learning
- **Science Department**: Experiments, observation, natural studies
- **Language Department**: Vocabulary, pronunciation, cultural learning
- **Art Department**: Creativity, visual arts, cultural appreciation

All teams also get access to generic wellness activities like exercise, meditation, and self-care.

## 🔧 Technical Details

### Real-Time Features
- **Polling-based sync**: Board updates every 10 seconds
- **User tracking**: Each tile stores who crossed it
- **Team isolation**: Each team has their own board and data

### Data Persistence
- **JSON file storage**: All data stored in local JSON files
- **Automatic initialization**: Data files created on first run
- **Backup-friendly**: Simple file structure for easy backups

### Security
- **Password validation**: Simple password-based authentication
- **Team isolation**: Users can only access their team's data
- **Input validation**: All API endpoints validate required fields

## 🎯 Use Cases

### Educational Institutions
- **Department Wellness Programs**: Encourage healthy habits within academic departments
- **Team Building**: Foster collaboration and friendly competition
- **Student Engagement**: Make wellness activities fun and social

### Corporate Wellness
- **Department Challenges**: Create team-based wellness initiatives
- **Employee Engagement**: Build community through shared activities
- **Health Promotion**: Encourage healthy habits in the workplace

### Community Groups
- **Social Clubs**: Organize wellness challenges for members
- **Fitness Groups**: Track group progress on health goals
- **Support Networks**: Build community through shared wellness activities

## 🚀 Future Enhancements

Potential features for future versions:
- WebSocket support for instant real-time updates
- Mobile app version
- Custom team creation
- Advanced analytics and reporting
- Integration with wellness tracking apps
- Multi-language support
- Custom prompt creation tools

## 🤝 Contributing

This is a simple, self-contained application designed for easy deployment and customization. Feel free to:
- Add new team prompts
- Customize the UI styling
- Add new features
- Improve the real-time functionality

## 📄 License

ISC License - feel free to use and modify for your needs.

---

**Happy Bingo-ing! 🎯✨** 