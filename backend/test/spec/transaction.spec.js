import test from 'ava';
import {userService} from '../../services/userService';
import {accountService} from '../../services/accountService';
import '../setup';

test.serial("register should return true", async (t) => {
    let user1 = await userService.register("hmustermann", "Hans", "Mustermann", "1234");
    let user2 = await userService.register("bmusterfrau", "Beatrice", "Musterfrau", "1234");
    t.not(user1, null);
    t.not(user2, null);
});

test.serial("second register should return false", async (t) => {
    try {
        let user = await userService.register("hmustermann", "Hans", "Mustermann", "1234");
    }
    catch (error) {
        t.is(error.statusCode, 400);
        t.not(error, null);
    }
});

test.serial("1000 amount after register", async (t) => {
    let accountA = await accountService.get("1000001");
    t.is(accountA.amount, 1000);
    let accountB = await accountService.get("1000002");
    t.is(accountB.amount, 1000);
});


test.serial("transaction above limit", async (t) => {
    await accountService.addTransaction("1000001", "1000002", 1500, null);
    t.is((await accountService.get("1000001")).amount, 1000);
    t.is((await accountService.get("1000002")).amount, 1000);
});

test.serial("transaction wrong target", async (t) => {
    try {
        await accountService.addTransaction("1000001", "XXXXXXXX", 500, null);
    }
    catch (error) {
        t.is((await accountService.get("1000001")).amount, 1000);
    }
});

test.serial("transaction wrong from", async (t) => {
    try {
        await accountService.addTransaction("XXXXXXXX", "1000002", 500, null);
    }
    catch (error) {
        t.is((await accountService.get("1000002")).amount, 1000);
    }
});

test.serial("transaction of 500", async (t) => {
    await accountService.addTransaction("1000001", "1000002", 500, null);
    t.is((await accountService.get("1000001")).amount, 500);
    t.is((await accountService.get("1000002")).amount, 1500);
});
