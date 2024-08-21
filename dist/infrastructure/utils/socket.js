"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const userRepositories_1 = __importDefault(require("../repositories/userRepositories"));
const repo = new userRepositories_1.default();
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    const users = {};
    io.on('connection', (socket) => {
        socket.on("user_login", (user_id) => {
            users[user_id] = socket.id;
            repo.updateOnlineStatus(user_id, true);
        });
        socket.on("private_message", ({ sender_id, reciever_id, message, role }) => __awaiter(void 0, void 0, void 0, function* () {
            const recipient = users[reciever_id];
            const data = { sender_id, reciever_id, message };
            const saveConversation = yield repo.saveInbox(reciever_id, sender_id, role);
            const save = yield repo.saveMessages(data);
            const updateinbox = yield repo.updateInbox(sender_id, reciever_id, message);
            if (recipient) {
                io.to(recipient).emit("private_message", { message, sender_id, reciever_id });
            }
        }));
        socket.on("notify", ({ user_id, connection_id, message }) => __awaiter(void 0, void 0, void 0, function* () {
            const addConnection = yield repo.connectUser(user_id, connection_id);
            const addnotification = yield repo.saveNotification(user_id, connection_id, message);
            if (addConnection && addnotification) {
                const data = yield repo.findNotification(user_id, connection_id);
                io.emit("notification", { message, data });
            }
        }));
        socket.on('disconnect', (reason) => {
            console.log(`A user disconnected: ${socket.id}, reason: ${reason}`);
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    repo.updateOnlineStatus(userId, false);
                    delete users[userId];
                    break;
                }
            }
        });
    });
};
exports.initializeSocket = initializeSocket;
