import  express from "express";
import userController from '../../adaptors/controllers/userController'
import userUsecase from "../../useCases/userUsecase";
import userRepository from "../repositories/userRepositories";
const router = express.Router()
const userRepo =new userRepository()
const userUsecases =new userUsecase(userRepo)

const UserController = new userController(userUsecases)
router.post('/signup',(req,res)=>UserController.signup(req,res))
router.post('/login',(req,res)=>UserController.login(req,res))




export default router