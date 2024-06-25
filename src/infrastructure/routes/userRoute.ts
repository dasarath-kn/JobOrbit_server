import  express from "express";
import userController from '../../adaptors/controllers/userController'
const router = express.Router()

const UserController = new userController()

router.post('/login',(req,res)=>UserController.login(req,res))




export default router