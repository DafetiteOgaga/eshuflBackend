const express = require('express'); // 🛠️ Load Express
const cors = require('cors'); // 🛠️ Load CORS
const mongoose = require('mongoose'); // 🛠️ Load Mongoose

const app = express(); // 🚀 Create an Express app
app.use(cors()) // allow all origins (for development)
app.use(express.json()); // 📦 Allow our app to accept JSON data

// ##########################################################
const { Randomize } = require('./hooks/Randomize');
const path = require('path'); // If not already imported
app.use('/public', express.static(path.join(__dirname, 'hooks', 'public')));
// ##########################################################

// 🔌 Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')) // ✅ Success message
  .catch((err) => console.error('Connection error', err)); // ❌ If it fails

// 🧩 Define what a "User" looks like (Schema)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

// 📘 Create a model based on the schema
const User = mongoose.model('User', UserSchema);

// 📍 A basic route to test if our app works
app.get('/', (req, res) => {
  res.send('Welcome to My World!\nWont you come on in?'); // ✅ Respond with a message
});

// ✏️ Add a new user (POST request)
app.post('/randomize', async (req, res) => {
  const received = req.body; // 🖥️ Log the request body
  // console.log(JSON.stringify(received, null, 2)); // 🖥️ Log the request body
  // const {email, name} = req.body; // 🧊 Create a user from request
  // await user.save(); // 💾 Save to database
  // const newUser = await User.create({email, name}); // 💾 Save to database
  // console.log({ newUser }); // 🖥️ Log the new user
  // res.status(201).send(newUser); // ✅ Respond with created user
  const downloadLink = await Randomize(received); // 🔄 Randomize the data
  console.log({ downloadLink }); // 🖥️ Log the result
  res.status(201).send({'success': 'Success', downloadLink}); // ✅ Respond with created user
});

// 📂 Get all users
app.get('/users', async (req, res) => {
  const users = await User.find(); // 🔍 Get all users
  console.log({ users }); // 🖥️ Log them
  res.send(users); // ✅ Send them back
});

// 🚀 Start the app
const portNumber = 4000; // 🔢 Port number
app.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});
