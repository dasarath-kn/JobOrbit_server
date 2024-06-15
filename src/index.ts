import express from 'express';
import mongodb from './infrastructure/config/connectDB'
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
