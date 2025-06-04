const express = require('express');
const cors = require('cors');
const router = require('./routes/TestRoutes')
const fs = require('fs');
const { cleanOldFilesAndDirs } = require('./hooks/cleanOldFilesAndDirs')
const { runCheckEvery } = require('./hooks/checkTime');
// const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors())
app.use(router)

// ##########################################################
// const { Randomize } = require('./hooks/Randomize');
const path = require('path');
const publicPath = path.join(__dirname, 'hooks', 'public');

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}
app.use('/public', express.static(publicPath));
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

  cleanOldFilesAndDirs()

  setInterval(() => {
    cleanOldFilesAndDirs()
  }, runCheckEvery);
});
