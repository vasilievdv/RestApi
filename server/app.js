const express = require('express');
const upload = require('express-fileupload');

const app = express();
require('dotenv').config();
const cors = require('cors');

const authRoute = require('./src/routes/auth.router');
const postRoute = require('./src/routes/data.router');
const infoRoute = require('./src/routes/info.router');

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(upload());
app.use(express.json());

app.use('/', authRoute);
app.use('/file', postRoute);
app.use('/info', infoRoute);

app.listen(process.env.PORT, () => { console.log(`Server Up and running on PORT ${process.env.PORT}`); });
