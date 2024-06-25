import express from 'express';
import mongodb from './infrastructure/config/connectDB'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import userRoute from './infrastructure/routes/userRoute'
dotenv.config()
const app = express();
const port =process.env.PORT
mongodb()
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',userRoute)


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
