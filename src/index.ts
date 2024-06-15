import express from 'express';
import mongodb from './frameworks/config/database'
import dotenv from 'dotenv'
dotenv.config()
const app = express();
const port =process.env.PORT
mongodb()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
