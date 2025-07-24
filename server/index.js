require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const generateText = require('./routes/generateText');
const generateImage = require('./routes/generateImage');
const generateColors = require('./routes/generateColors');
const requireAuth = require('./middleware/authMiddleware');
const moodboardRoutes = require('./routes/moodboards');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
connectDB();

app.use((req, res, next) => {
  console.log(`➡️ Incoming: ${req.method} ${req.url}`);
  next();
});

app.use('/api/generate', requireAuth, generateText);
app.use('/api/generate-image', requireAuth, generateImage);
app.use('/api/generate-colors', requireAuth, generateColors);
app.use('/api/moodboards', moodboardRoutes);

app.listen(3001, () => {
  console.log("🌐 MoodForge backend running at http://localhost:3001");
});
