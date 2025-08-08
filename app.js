const express = require("express");

const morgan=require("morgan");
const caseRoute=require('./routes/caseRoute');
const lawyerRoute=require('./routes/lawyerRoute');
const applicationRoute=require('./routes/applicationRoute');
const clientRoute=require('./routes/clientRoute');
const app=express();



app.use(express.json());
app.use(morgan('dev'));
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
});


app.use('/api/v1/requests',caseRoute);
app.use('/api/lawyers',lawyerRoute);
app.use('/api/applications',applicationRoute);
app.use('/api/clients',clientRoute);


module.exports=app;

