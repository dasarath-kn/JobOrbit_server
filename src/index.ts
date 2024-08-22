import express from 'express';
import mongodb from './infrastructure/config/connectDB'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import userRoute from './infrastructure/routes/userRoute'
import adminRoute from './infrastructure/routes/adminRoute';
import companyRoute from './infrastructure/routes/companyRoute';
import cors from 'cors'
import path from 'path';
import http from 'http'
import { initializeSocket } from './infrastructure/utils/socket';
dotenv.config()
const app = express();
const port =process.env.PORT
mongodb()
const server =http.createServer(app)
 initializeSocket(server)

const corsOptions = {
  origin: ['https://joborbit.vercel.app','http://localhost:5173'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../../public')));
app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/company',companyRoute)


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
