// db message
type MessageObject = Record<string, string>
export const DBMessage: MessageObject = {
  SUCCESS: 'Successful Connection to DB instances..',
  ERROR: 'Database Connection Error..',
  PUBLIC_MESSAGE: 'An error occurred. Please try again later',
};
