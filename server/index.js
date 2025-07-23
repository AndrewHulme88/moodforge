require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
connectDB();

// Mount routes
app.use('/api/generate', require('./routes/generateText'));
app.use('/api/generate-image', require('./routes/generateImage'));
app.use('/api/generate-colors', require('./routes/generateColors'));

app.listen(3001, () => {
  console.log("🌐 MoodForge backend running at http://localhost:3001");
});
