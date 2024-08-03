import { Server,Socket } from "socket.io"
import { Server as HTTPServer } from "http";


export const initializeSocket = (server: HTTPServer) => {
   
    
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    }); 

    io.on('connection', (socket: Socket) => {
         socket.on("notify",(mes)=>{
            io.emit("notification",mes)
        
        })

        
        // Listen for disconnection
        socket.on('disconnect', (reason) => {
            console.log(`A user disconnected: ${socket.id}, reason: ${reason}`);
        });
    });
};


