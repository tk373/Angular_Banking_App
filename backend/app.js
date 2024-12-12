import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import debugLib from 'debug';
import dotenv from 'dotenv';

import { config } from './config.js';
import { dataSeed } from './util/dataSeed.js';
import { accountRouter } from './routes/accountRouter.js';
import { userRouter, userRouterProtected } from './routes/userRouter.js';

// Load environment variables (useful for local development)
dotenv.config();

const app = express();
const debug = debugLib(config.env.loggingScope);
const log = debugLib(config.env.appLoggingScope);

log("Booting up, please wait...");
console.log('Booting up, please wait...');

// Seed the database
dataSeed.insertSeedData();

/**
 * Middleware registration
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.resolve('./public')));

/**
 * Routes registration
 */
app.use('/auth', userRouter);
app.use(jwt(config.jwt.validateOptions)); // Middleware for protected routes
app.use('/auth', userRouterProtected);
app.use('/accounts', accountRouter);

/**
 * Catch-all for 404 errors
 */
app.use((req, res, next) => {
  res.status(404).send();
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  log(err.stack);
  res.status(err.statusCode || 500).send({
    data: err.data || null,
    message: err.message || 'Internal Server Error',
  });
});

/**
 * Server setup
 */
const port = normalizePort(process.env.PORT || config.env.defaultServerPort);
app.set('port', port);

const server = http.createServer(app, config.env.defaultHostname);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Helper functions
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      console.error(error);
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${config.env.defaultHostname}:${port}`);
  log(`Listening on ${config.env.defaultHostname}:${port}`);
}

export default app;
