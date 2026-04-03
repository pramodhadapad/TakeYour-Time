require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect Database
connectDB();


// Ensure required ENV vars are set
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Auth will fail.');
}

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
