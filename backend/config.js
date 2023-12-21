/**
 * JWT Settings
 */
const jwtSecret =  '08bca4435f1a4c46801691c859ce504716fd68fd113d43ecbc2754649ee401f7380ac84e877a481f84a3ec8c530851958773d1af93bf4b4cba15bd04c627de01';
const signOptions = {expiresIn: "1d", audience :"self", issuer : "bank"};
const validateOptions = {secret: jwtSecret, audience :"self", issuer : "bank", algorithms: ['HS256']};

/**
 * Global Database Settings
 */
const inMemory = false;
const dbPath = {
    users: './data/users.db',
    accounts: './data/accounts.db',
    transactions: './data/transactions.db'
};


/**
 * Account Management Settings
 */
const initialBalance = 1000;


/**
 * Environment Override Settings.
 */
const defaultServerPort = '3000';
const defaultHostname = 'localhost';
const loggingScope = 'bwzFinanceServer:*';
const appLoggingScope = 'bwzFinanceServer:www';

export const config = {
    jwt: {jwtSecret, signOptions, validateOptions},
    db: {inMemory, dbPath},
    account: {initialBalance},
    env: { defaultServerPort, defaultHostname, appLoggingScope, loggingScope }
};