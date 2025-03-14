import * as path from 'path';

export const APP_ROOT = path.resolve(__dirname, '..', '..');
export const STATIC_DIR = path.resolve(APP_ROOT, 'static');
export const PORT = 'PORT';
export const PROXY = 'PROXY';
export const SOCKETIO_PORT = 'SOCKETIO_PORT';
export const SOCKETIO_PROXY = 'SOCKETIO_PROXY';
export const FRONTEND_PATH = 'FRONTEND_PATH';
export const PROTOCOL_STR = 'PROTOCOL_STR';
export const DOMAIN_STR = 'DOMAIN_STR';
export const ACCESS_SECRET = 'ACCESS_SECRET';
export const FREE_INTERVIEW_LIMIT = 'FREE_INTERVIEW_LIMIT';

export default () => ({
  [PORT]: process.env[PORT] || 3000,
  [PROXY]: process.env[PROXY] || 'cv',
  //not in use
  // [SOCKETIO_PORT]: process.env[SOCKETIO_PORT] || 3000,
  // [SOCKETIO_PROXY]: process.env[SOCKETIO_PROXY] || 'gammaweb',
  [FRONTEND_PATH]: process.env[FRONTEND_PATH] || `http://cv.ru`,
  [PROTOCOL_STR]: process.env.PROTOCOL_STR || `http`,
  [DOMAIN_STR]: process.env.DOMAIN_STR || `localhost`,
  [ACCESS_SECRET]: process.env.ACCESS_SECRET || `localEWE`,
  [FREE_INTERVIEW_LIMIT]: process.env[FREE_INTERVIEW_LIMIT] || 10,
});
