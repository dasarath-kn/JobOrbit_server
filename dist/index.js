"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDB_1 = __importDefault(require("./infrastructure/config/connectDB"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoute_1 = __importDefault(require("./infrastructure/routes/userRoute"));
const adminRoute_1 = __importDefault(require("./infrastructure/routes/adminRoute"));
const companyRoute_1 = __importDefault(require("./infrastructure/routes/companyRoute"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./infrastructure/utils/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
(0, connectDB_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../../public')));
app.use('/', userRoute_1.default);
app.use('/admin', adminRoute_1.default);
app.use('/company', companyRoute_1.default);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
