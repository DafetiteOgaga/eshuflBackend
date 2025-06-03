require('dotenv').config(); // loads .env variables
const mongoose = require('mongoose');

let mongoUri
if (process.env.NODE_ENV === 'production') {
	mongoUri = process.env.MONGODB_URI;
} else if (process.env.NODE_ENV === 'development') {
	mongoUri = 'mongodb://localhost:27017/myapp'
}
console.log('\nConnecting to MongoDB...\n', mongoUri);

mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log(`MongoDB Connected to ${process.env.NODE_ENV === 'production'?'Atlas':process.env.NODE_ENV === 'development'?'Local':'I dont know this'} DB\n\n`))
.catch((err) => console.error('Connection error', err));

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
	correct_answer: { type: String, required: true, trim: true },
	explanation: { type: String, default: '', trim: true },
});

const TestSchema = new mongoose.Schema({
	typeCategory: { type: String, required: true, trim: true },
	classCategory: { type: String, required: true, trim: true },
	subject: { type: String, required: true, trim: true },
	questions: [QuestionSchema], // Embedding QuestionSchema
});

const Tests = mongoose.model('Tests', TestSchema);

module.exports = Tests;