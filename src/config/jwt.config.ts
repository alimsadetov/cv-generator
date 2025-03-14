export const REFRESH_SECRET = 'REFRESH_SECRET';
export const ACCESS_SECRET = 'ACCESS_SECRET';
export const ACCESS_TOKEN_DURATION = 'ACCESS_TOKEN_DURATION';
export const SALT_ROUNDS = 'SALT_ROUNDS';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
export const COOKIE_DOMAIN = 'COOKIE_DOMAIN';

export default () => ({
  [REFRESH_SECRET]: process.env[REFRESH_SECRET] || 'REFRESH_SECRET',
  [ACCESS_SECRET]: process.env[ACCESS_SECRET] || 'ACCESS_SECRET',
  [ACCESS_TOKEN_DURATION]: process.env[ACCESS_TOKEN_DURATION] || '1d',
  [SALT_ROUNDS]: process.env[SALT_ROUNDS]
    ? Number(process.env[SALT_ROUNDS])
    : 10,
  [REFRESH_TOKEN_COOKIE_NAME]:
    process.env[REFRESH_TOKEN_COOKIE_NAME] || 'refresh_token',
  [COOKIE_DOMAIN]: process.env[COOKIE_DOMAIN] || '.cv.ru',
});
