//One more important thing you can also insert multer for image and video
//and store that in ./media folder to make this project more interesting

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

app.use(signupRoute);//sign-up
app.use(loginRoute);//login 
app.use(forgotRoute);//forgot password route
app.use(postRoute);//post and see post (by Post id and profile)
app.use(liked);//likes on the post 
app.use(cmnt);//commnets on the post
