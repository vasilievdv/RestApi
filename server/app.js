const express = require('express');

const app = express();
require('dotenv').config();
const cors = require('cors');

const authRoute = require('./src/routes/auth.router');
const postRoute = require('./src/routes/data.router');

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/data', postRoute);

app.listen(process.env.PORT, () => { console.log(`Server Up and running on PORT ${process.env.PORT}`); });
