import { logger } from './components/logging';
import express, {Express} from "express";
import router from "./routes/home";
import { info } from 'winston';


const app: Express = express();

logger();
app.use(router);

//define the application listinig port
//the port value equals the value defined in the .env file, or 8081 if the file doesn't exist
const port: String = process.env.PORT || '8081';
app.listen( port, () => info(`Listening on port ${port}....`));