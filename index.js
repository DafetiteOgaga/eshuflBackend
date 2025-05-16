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

// 🧩 Define what a "TestQuestion" looks like (Schema)
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  image: { type: String, default: null, trim: true },
  options: {
    type: [String],
    validate: {
      validator: function (v) { return Array.isArray(v) && v.length === 4 },
      message: 'Each question must have exactly 4 options.',
    },
  },
  correctAnswer: { type: String, required: true, trim: true },
  explanation: { type: String, default: '', trim: true },
});

const TestSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  class: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  questions: [QuestionSchema], // Embedding the schema
});


// const UserSchema = new mongoose.Schema({
//   type: String,
//   class: String,
//   subject: String,
//   questions: Array,
// });
// const User = mongoose.model('User', UserSchema); // 📘 Create a model based on the schema
// 📘 Create a model based on the schema
const Tests = mongoose.model('Tests', TestSchema);

// 📍 A basic route to test if our app works
app.get('/', (req, res) => {
  res.send('Welcome to My World!\nWont you come on in?'); // ✅ Respond with a message
});

const allPoints = {
  randomize: '/randomize',
  takeTests: '/take-tests',
  preTests: '/pre-tests',
  createTests: '/create-tests',
}

// ✏️ Randomize exam questions (POST request)
app.post(allPoints.randomize, async (req, res) => {
  const received = req.body;
  const downloadLink = await Randomize(received);
  console.log({ downloadLink });
  res.status(201).send({'success': 'Success', downloadLink});
});

// ✏️ Submit/create new test questions (POST request)
app.post(allPoints.createTests, async (req, res) => {
  const received = req.body; // 🖥️ Log the request body
  // console.log(JSON.stringify(received, null, 2)); // 🖥️ Log the request body
  // const {email, name} = req.body; // 🧊 Create a user from request
  // await user.save(); // 💾 Save to database
  // const newUser = await User.create({email, name}); // 💾 Save to database
  // console.log({ newUser }); // 🖥️ Log the new user
  // res.status(201).send(newUser); // ✅ Respond with created user
  // const downloadLink = await Randomize(received); // 🔄 Randomize the data
  // console.log('take-tests:', received); // 🖥️ Log the result
  console.log(`${allPoints.createTests} <<< :`, JSON.stringify(received, null, 2)); // 🖥️ Log the result
  res.status(201).send({'success': 'Success'}); // ✅ Respond with created user
});

// ✏️ Submit answered test questions (POST request)
app.post(allPoints.takeTests, async (req, res) => {
  const received = req.body; // 🖥️ Log the request body
  // console.log(JSON.stringify(received, null, 2)); // 🖥️ Log the request body
  // const {email, name} = req.body; // 🧊 Create a user from request
  // await user.save(); // 💾 Save to database
  // const newUser = await User.create({email, name}); // 💾 Save to database
  // console.log({ newUser }); // 🖥️ Log the new user
  // res.status(201).send(newUser); // ✅ Respond with created user
  // const downloadLink = await Randomize(received); // 🔄 Randomize the data
  // console.log('take-tests:', received); // 🖥️ Log the result
  console.log(`${allPoints.takeTests} <<< :`, JSON.stringify(received, null, 2)); // 🖥️ Log the result
  res.status(201).send({'success': 'Success'}); // ✅ Respond with created user
});
// ✏️ Take test questions (GET request)
app.get(allPoints.takeTests, (req, res) => {
  console.log({sendGet})
  res.send(sendGet); // ✅ Respond with a message
});

// ✏️ Request-test (POST request)
app.post(allPoints.preTests, async (req, res) => {
  const received = req.body;
  console.log(`${allPoints.preTests} <<< :`, JSON.stringify(received, null, 2));
  const {
    name,
    email,
    typeCategory,
    classCategory,
    subject,
    duration } = req.body;
    console.log(
      'results:',
      {
      name,
      email,
      typeCategory,
      classCategory,
      subject,
      duration
    });
  const tests = await Tests.find({
    name,
    email,
    typeCategory,
    classCategory,
    subject,
    duration })
  console.log('tests:', { tests });
  // await user.save(); // 💾 Save to database
  // const newUser = await User.create({email, name}); // 💾 Save to database
  // console.log({ newUser }); // 🖥️ Log the new user
  // res.status(201).send(newUser); // ✅ Respond with created user
  // const downloadLink = await Randomize(received); // 🔄 Randomize the data
  console.log('duration:', received.duration)
  res.status(201).send({'success': 'Success', 'goto': allPoints.takeTests}); // ✅ Respond with created user
});

// 📂 Get all users
// app.get('/users', async (req, res) => {
//   const users = await User.find(); // 🔍 Get all users
//   console.log({ users }); // 🖥️ Log them
//   res.send(users); // ✅ Send them back
// });

// 🚀 Start the app
const portNumber = 4000; // 🔢 Port number
app.listen(portNumber, () => {
  console.log(`Server running on http://localhost:${portNumber}`);
});

const sampleQuestions = [
	{
		question: "Which of the following best describes Newton's 2nd Law?",
		image: null,
        options: [
			'Force equals mass times velocity',
			'Force equals mass times acceleration',
			'Force equals velocity divided by mass',
			'Mass equals force divided by acceleration',
		],
	},
	{
		question: 'What is the acceleration due to gravity on Earth?',
		image: null,
        options: [
			'5.8 m/s²',
			'9.8 m/s²',
			'10.5 m/s²',
			'15.2 m/s²',
		],
	},
	{
		question: 'What is inertia?',
		image: null,
        options: [
			'The resistance of an object to a change in its state of motion',
			'The force that pulls objects toward the ground',
			'The rate of change of velocity',
			'The ability of an object to maintain its position',
		],
	},
	{
		question: 'What is the SI unit of force?',
		image: null,
		options: [
			'Joule',
			'Watt',
			'Newton',
			'Pascal',
		],
	},
	{
		question: 'Which of the following distinguishes speed from velocity?',
		image: null,
        options: [
			'Speed includes direction, but velocity does not',
			'Speed is a scalar quantity, and velocity is a vector quantity',
			'Speed measures change in distance, velocity measures change in speed',
			'Speed and velocity are the same',
		],
	},
]

const sendGet = {
  'questions': sampleQuestions,
  'duration': 5,
}
