import Application from './app.ts'



// initiate an express instance
const expressApp = new Application();

// start the application
export default expressApp.getServer();
