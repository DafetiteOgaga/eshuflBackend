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

const ash = '#####'
console.log(
  '\n', ash.repeat(5),
  '\nenv:', process.env.NODE_ENV,
  '\nport:', process.env.PORT,
  '\nserver origin:', process.env.SERVER_ORIGIN,
  '\nserver origin from env:', process.env.SERVER_ORIGIN,
  '\n', ash.repeat(5),
)
const portNumber = process.env.PORT||4000; // 🔢 Port number
app.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
