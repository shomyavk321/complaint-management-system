const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shomyavk321_db_user:LDLgIzVZf3QeRZ60@cluster0.prxcnwm.mongodb.net/complaint-system?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err.message));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));

app.get('/', (req, res) => res.send('API running'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));