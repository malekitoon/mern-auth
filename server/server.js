const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch(err => {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  });

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors()); // allows all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `http://localhost:3000` }));
}

// middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`API is now running on port ${port}`);
});
