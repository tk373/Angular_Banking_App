import Datastore from 'nedb';
import {resultUtil} from '../util/resultUtil';
import {toQuery, toCountedQuery} from '../util/dbUtil';
import {config} from '../config';

const db = new Datastore(config.db.inMemory ? {} : {filename: config.db.dbPath.accounts, autoload: true});

// DB schema / settings
const dbTransaction = new Datastore(config.db.inMemory ? {} : {
    filename: config.db.dbPath.transactions,
    autoload: true
});

db.ensureIndex({fieldName: 'accountNr', unique: true, sparse: true});


/**
 *  Account Service Facilities & API
 */

function createTransactionObj(from, target, amount, total, date, category) {
    return {
        from,
        target,
        amount,
        total,
        category,
        date: date ? date : new Date()
    };
}

async function createAccount(ownerId, accountNr, creationDate) {
    await toQuery(finish => {
        dbTransaction.insert(createTransactionObj("00000000", accountNr, config.account.initialBalance, void 0, creationDate), finish);
    });

    return {
        ownerId,
        accountNr,
        amount: config.account.initialBalance
    };
}


async function add(ownerId, accountNr, creationDate) {
    if (accountNr && ownerId) {
        const newAccount = await createAccount(ownerId, accountNr, creationDate);

        return await toQuery(finish => {
            db.insert(newAccount, finish);
        });
    }
    throw resultUtil.createNotFoundResult();
}


async function get(accountNr) {
    if (accountNr) {
        const account = await toQuery(finish => {
            db.findOne({accountNr}, {_id: 0}, finish);
        });
        if (account) {
            return account;
        }
    }
    throw resultUtil.createNotFoundResult();
}

async function addTransaction(from, target, amount, date = null, category = undefined) {
    try {
        const fromAccount = await get(from);
        const targetAccount = await get(target);

        if (from !== target
            && !isNaN(amount) && amount > 0
            && fromAccount && fromAccount.amount >= amount
            && targetAccount) {

            let fromAccountAmount = fromAccount.amount - Number(amount);
            let targetAccountAmount = targetAccount.amount + Number(amount);

            const transactionFrom = await toQuery(finish => {
                dbTransaction.insert(createTransactionObj(from, target, -amount, fromAccountAmount, date, category), finish);
            });
            const transactionTarget = await toQuery(finish => {
                dbTransaction.insert(createTransactionObj(from, target, amount, targetAccountAmount, date, category), finish);
            });

            const affectedFromAccount = await toCountedQuery(finish => {
                db.update({accountNr: from}, {$set: {amount: fromAccountAmount}}, finish);
            });
            const affectedTargetAccount = await toCountedQuery(finish => {
                db.update({accountNr: target}, {$set: {amount: targetAccountAmount}}, finish);
            });

            delete transactionFrom._id;
            return transactionFrom;
        }
    } catch (err) {
        throw resultUtil.createErrorResult(err);
    }
}

async function getTransactions(accountId, count, skip, fromDate, toDate) {
    if (typeof(count) === 'undefined' && !(fromDate && toDate)) {
        return {query: {count, skip, fromDate, toDate}, result: []};
    }

    let find = {
        $or: [
            {from: accountId, amount: {$lte: 0}},
            {target: accountId, amount: {$gte: 0}}
        ],
		$and: [
			{total: {$exists: true}}
		]
    };

    if (fromDate && toDate) {
        find.$and.push( {date: {$gte: fromDate}} );
		find.$and.push( {date: {$lte: toDate}} );
    }

    return await toQuery(finish => {
        let query = dbTransaction.find(find, {_id: 0}).sort({date: -1});
        if (skip > 0) {
            query = query.skip(skip);
        }
        if (count > 0) {
            query = query.limit(count);
        }
        dbTransaction.count(find, (err, resultcount) => {
            if (!err) {
                query.exec((err, docs) => {
                    finish(err, {query: {resultcount, count, skip, fromDate, toDate}, result: docs});
                });
            } else {
                finish(err);
            }
        });
    });
}

export const accountService =  {add, get, addTransaction, getTransactions};
