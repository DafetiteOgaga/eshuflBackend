const express = require('express');
const cors = require('cors');
const router = require('./routes/TestRoutes')
// const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors())
app.use(router)

// ##########################################################
// const { Randomize } = require('./hooks/Randomize');
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'hooks', 'public')));
// ##########################################################

const portNumber = 4000; // 🔢 Port number
app.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
