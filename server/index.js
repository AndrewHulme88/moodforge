const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('MoodForge API running'));
app.listen(3001, () => console.log('Server running on port 3001'));
