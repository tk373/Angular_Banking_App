import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import bodyParser from 'body-parser';

import path from 'path';
import logger from 'morgan';
import cors from 'cors';

import {config} from './config';
import {dataSeed} from './util/dataSeed';

import {accountRouter} from './routes/accountRouter';
import {userRouter, userRouterProtected} from './routes/userRouter';

const app = express();


// insert data
dataSeed.insertSeedData();

/**
 * Register node middlewares
 */
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(cors());

// route static html/js/css files
app.use(express.static(path.resolve('./public')));

// register REST routes
app.use('/auth', userRouter);
app.use(jwt(config.jwt.validateOptions)); // after this middleware a token is required!
app.use('/auth', userRouterProtected);
app.use('/accounts', accountRouter);

app.use(function(req, res, next) {
  res.status(404);
  res.send();
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500);
  res.send({data: err.data, message: err.message});
});

export default app;
