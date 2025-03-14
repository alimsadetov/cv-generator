export const MAILER_EMAIL = 'MAILER_EMAIL';
export const MAILER_HOST = 'MAILER_HOST';
export const MAILER_USER = 'MAILER_USER';
export const MAILER_PASSWORD = 'MAILER_PASSWORD';
export const MAILER_FROM_PREFIX = 'MAILER_FROM_PREFIX';

export default () => ({
  [MAILER_EMAIL]: process.env[MAILER_EMAIL] || 's',
  [MAILER_HOST]: process.env[MAILER_HOST] || '',
  [MAILER_USER]: process.env[MAILER_USER] || 'daom',
  [MAILER_PASSWORD]: process.env[MAILER_PASSWORD] || 'fdudvcr',
  [MAILER_FROM_PREFIX]: process.env[MAILER_FROM_PREFIX] || '',
});
