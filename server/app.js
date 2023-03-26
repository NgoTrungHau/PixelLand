require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ApiError = require('./app/api-error');

const app = express();

const userRouter = require('./app/routes/user.route');
const postRouter = require('./app/routes/post.route');
const artRouter = require('./app/routes/art.route');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PixelLand application.' });
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/arts', artRouter);

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
