const express = require('express');
const cors = require('cors');
const ApiError = require('./app/api-error');

const app = express();

const artsRouter = require('./app/routes/art.route');
const usersRouter = require('./app/routes/user.route');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PixelLand application.' });
});

app.use('/api/arts', artsRouter);
app.use('/api/users', usersRouter);

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, 'Resource not found'));
});

app.use((ApiError, req, res, next) => {
  return res.status(ApiError.statusCode || 500).json({
    message: ApiError.message || 'Internal Server Error',
  });
});

module.exports = app;
