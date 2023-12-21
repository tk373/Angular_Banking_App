import {createHmac} from 'crypto';
import jwt from 'jsonwebtoken';

const PWD_SERVER_SECRET = 'DO_NOT_LEAK_THIS_SECRET!';

function hashPwd(pwd){
  return createHmac('sha256', PWD_SERVER_SECRET) //more information: https://nodejs.org/api/crypto.html
    .update(pwd)
    .digest('hex');
}

async function createToken(data, secret, options) {
  return new Promise((resolve, reject) => {
      jwt.sign(data, secret, options, (err, token) => {
          if (err) {
              reject(err);
          } else {
              resolve(token);
          }
      });
  });
}

export const cryptoUtil = {hashPwd, createToken};


