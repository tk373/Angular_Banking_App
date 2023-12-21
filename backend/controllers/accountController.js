import {accountService} from '../services/accountService';
import {userService} from '../services/userService';

async function getAccountByParams(req, res, next) {
	await getAccount(req, res, next, req.params?.accountNr);
}

async function getAccountByToken(req, res, next) {
	await getAccount(req, res, next, getAccountNrByJwt(req));
}

async function getAccount(req, res, next, accountNr) {
  try {
      const account = await accountService.get(accountNr);
      const user = await userService.getById(account.ownerId);

      if (getAccountNrByJwt(req) === accountNr) {
          account.owner = user;
          res.json(account);
      }
      else {
          let {accountNr} = account;
          let {firstname, lastname} = user;
          res.json({accountNr, owner: {firstname, lastname}});
      }
  }
  catch (err) {
      next(err);
  }
}

async function getTransactions(req, res, next) {
    try {
        res.json(
            await accountService.getTransactions(
                getAccountNrByJwt(req),
                req.query.count ? parseInt(req.query.count) : 0,
                req.query.skip ? parseInt(req.query.skip) : 0,
                req.query.fromDate ? new Date(req.query.fromDate) : null,
                req.query.toDate ? new Date(req.query.toDate) : null));
    } catch (err) {
        next(err);
    }
}

async function addTransactions(req, res, next) {
    try {
        res.json(
            await accountService.addTransaction(
                getAccountNrByJwt(req),
                String(req.body.target),
                parseFloat(req.body.amount),
                null,
                req.body.category));
    } catch (err) {
        next(err);
    }
}

function getAccountNrByJwt(req) { 
    return String((req.user || req.auth)?.accountNr || '');
}

export const accountController = { getAccountByToken, getAccountByParams, getTransactions, addTransactions };
