import { App } from './app';
import { AuthController } from './apps/auth/auth.controller';
import dotenv from 'dotenv'
dotenv.config()



// initiate an express instance
const app = new App([AuthController.getInstance()], process.env.PORT || 3000);
App
// start the application
app.start()
