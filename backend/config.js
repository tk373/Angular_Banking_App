import dotenv from 'dotenv';

// Load environment variables from .env file (optional for local development)
dotenv.config();

/**
 * JWT Settings
 */
const jwtSecret = process.env.JWT_SECRET || '08bca4435f1a4c46801691c859ce504716fd68fd113d43ecbc2754649ee401f7380ac84e877a481f84a3ec8c530851958773d1af93bf4b4cba15bd04c627de01';
const signOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  audience: process.env.JWT_AUDIENCE || "self",
  issuer: process.env.JWT_ISSUER || "bank"
};
const validateOptions = {
  secret: jwtSecret,
  audience: process.env.JWT_AUDIENCE || "self",
  issuer: process.env.JWT_ISSUER || "bank",
  algorithms: ['HS256']
};

/**
 * Global Database Settings
 */
const inMemory = process.env.DB_IN_MEMORY === 'true' || false;
const dbPath = {
  users: process.env.DB_USERS_PATH || './data/users.db',
  accounts: process.env.DB_ACCOUNTS_PATH || './data/accounts.db',
  transactions: process.env.DB_TRANSACTIONS_PATH || './data/transactions.db'
};

/**
 * Account Management Settings
 */
const initialBalance = parseInt(process.env.INITIAL_BALANCE, 10) || 1000;

/**
 * Environment Override Settings.
 */
const defaultServerPort = process.env.PORT || '3000'; // Render sets `PORT` by default
const defaultHostname = process.env.HOSTNAME || 'localhost';
const loggingScope = process.env.LOGGING_SCOPE || 'bwzFinanceServer:*';
const appLoggingScope = process.env.APP_LOGGING_SCOPE || 'bwzFinanceServer:www';

export const config = {
  jwt: { jwtSecret, signOptions, validateOptions },
  db: { inMemory, dbPath },
  account: { initialBalance },
  env: { defaultServerPort, defaultHostname, appLoggingScope, loggingScope }
};
