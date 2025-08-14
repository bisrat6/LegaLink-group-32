const express = require('express');

const morgan = require('morgan');
const caseRoute = require('./routes/caseRoute');
const lawyerRoute = require('./routes/lawyerRoute');
const applicationRoute = require('./routes/applicationRoute');
const clientRoute = require('./routes/clientRoute');
const userRoute = require('./routes/userRoute');
const AppError = require('./utils/appError');
const globalError = require('./controllers/errorController');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/cases', caseRoute);
app.use('/api/lawyers', lawyerRoute);
app.use('/api/clients', clientRoute);
app.use('/api/user', userRoute);
// Mount generic '/api' routes last to avoid intercepting specific routers
app.use('/api', applicationRoute);

// Forward unmatched routes to error middleware as 404

app.use((req, res, next) => {
  next(new AppError("Can't find requested URL on this server", 404));
});
app.use(globalError);

module.exports = app;
