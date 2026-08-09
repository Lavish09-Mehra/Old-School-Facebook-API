import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import signupRoute from './loginRoutes/signup.js';
import loginRoute from './loginRoutes/login.js';
import forgotRoute from './loginRoutes/forgotpass.js';
import postRoute from './src/post.js';
import liked from './src/like.js';
import cmnt from './src/comments.js';

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Successfully connected to database');
    app.listen(process.env.PORT, () => {
      console.log(`server: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

app.get('/', (req, res) => {
  res.json({
    message: 'I am working Boss..',
    status: 200,
    success: 'Up'
  });
});

app.use(signupRoute);
app.use(loginRoute);
app.use(forgotRoute);
app.use(postRoute);
app.use(liked);
app.use(cmnt);