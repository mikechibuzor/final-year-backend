import { App } from './app';
import { AuthController } from './apps/auth/auth.controller';
import { ProjectController } from './apps/projects/project.controller';
import { BookmarkController } from './apps/bookmarks/bookmark.controller';
import { SupervisorController } from './apps/supervisors/supervisor.controller';
import dotenv from 'dotenv'
dotenv.config()



// initiate an express instance
const app = new App([
  AuthController.getInstance(), 
  ProjectController.getInstance(), 
  BookmarkController.getInstance(), 
  SupervisorController.getInstance()
], process.env.PORT || 3000);
// start the application
app.start()
