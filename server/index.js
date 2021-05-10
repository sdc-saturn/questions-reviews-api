const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/qa', questionRoutes);
app.use('/qa', answerRoutes);

app.listen(port, () => {
  console.log(`Running pn http://localhost:${port}`)
});

module.exports = app;