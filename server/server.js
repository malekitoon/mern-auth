const express = require('express');
const PORT = process.env.port || 8000;

const app = express();

// import routes
const authRoutes = require('./routes/auth');

// middlewares
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`API is now running on port ${PORT}`);
});