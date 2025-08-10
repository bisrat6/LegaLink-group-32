const express = require('express');

const morgan = require('morgan');
const caseRoute = require('./routes/caseRoute');
const lawyerRoute = require('./routes/lawyerRoute');
const applicationRoute = require('./routes/applicationRoute');
const clientRoute = require('./routes/clientRoute');

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
app.use('/api/applications', applicationRoute);
app.use('/api/clients', clientRoute);

module.exports = app;
