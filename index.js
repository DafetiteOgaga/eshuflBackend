const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

// ##########################################################
const path = require('path'); // If not already imported
app.use('/public', express.static(path.join(__dirname, 'hooks', 'public')));
// ##########################################################
const testRoutes = require('./routes/TestRoutes')
app.use('/', testRoutes)

// 🚀 Start the app
const portNumber = 4000; // 🔢 Port number
app.listen(portNumber, () => {
	console.log(`Server running on http://localhost:${portNumber}`);
});
