const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/generate', require('./routes/generateText'));
app.use('/api/generate-image', require('./routes/generateImage'));
app.use('/api/generate-colors', require('./routes/generateColors'));

app.listen(3001, () => {
  console.log("🌐 MoodForge backend running at http://localhost:3001");
});
