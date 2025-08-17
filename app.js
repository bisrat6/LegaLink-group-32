const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const caseRoute = require('./routes/caseRoute');
const lawyerRoute = require('./routes/lawyerRoute');
const applicationRoute = require('./routes/applicationRoute');
const clientRoute = require('./routes/clientRoute');
const userRoute = require('./routes/userRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(helmet());

app.use(hpp());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' })); // Limit JSON body size to 10kb
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
app.use('/api/lawyers', lawyerRoute);
app.use('/api/clients', clientRoute);
app.use('/api/user', userRoute);
app.use('/api/cases', caseRoute);
// Mount generic '/api' routes last to avoid intercepting specific routers
app.use('/api', applicationRoute);

// Forward unmatched routes to error middleware as 404

app.use((req, res, next) => {
  next(new AppError("Can't find requested URL on this server", 404));
});
app.use(globalErrorHandler);

module.exports = app;
