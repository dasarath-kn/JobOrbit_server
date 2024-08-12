import { Server,Socket } from "socket.io"
import { Server as HTTPServer } from "http";
import userRepository from "../repositories/userRepositories";
import message from "../../entities/message";

const repo =new userRepository()
export const initializeSocket = (server: HTTPServer) => {
   
    
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    }); 
    const users ={}

    io.on('connection', (socket: Socket) => {
        socket.on("user_login",(user_id)=>{
           users[user_id]=socket.id           
            
        }) 

        socket.on("private_message",async({sender_id,reciever_id,message})=>{
           
            const recipient = users[reciever_id]
            if(recipient){
                const data ={sender_id,reciever_id,message}
                const saveConversation = await repo.saveInbox(reciever_id,sender_id,)
                const save = await repo.saveMessages(data as message)
                const updateinbox =await repo.updateInbox(sender_id,reciever_id,message)
                io.to(recipient).emit("private_message",{message,sender_id,reciever_id})
            }
        })
        
        
        socket.on("notify",async({user_id,connection_id,message})=>{          
            const addConnection = await repo.connectUser(user_id,connection_id)
            const addnotification = await repo.saveNotification(user_id,connection_id,message)
            if(addConnection && addnotification){
            const data = await repo.findNotification(user_id,connection_id)
            
            io.emit("notification",{message,data})
           }
        
        })

        
        socket.on('disconnect', (reason) => {
            console.log(`A user disconnected: ${socket.id}, reason: ${reason}`);
            for (const userId in users) {
                if (users[userId] === socket.id) {
                  delete users[userId];
                  break;
                }
              }
        });
    });
};


