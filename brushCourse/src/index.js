/*
 * @Author: ytj 
 * @Date: 2018-07-23 08:27:47 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-23 16:51:42
 */

 "use strict";

const fs = require('mz/fs');
const path = require('path');
const registerAndStart = require('./register');

const dealEmails = async () => {
  const content = await fs.readFile(path.resolve(__dirname, './emails.txt' ), {encoding: 'utf-8'});
  const regPattern = /(\w+?@\w+?.com)----(\w+)/g;
  let matchResult;
  let emails = [];
  while (matchResult = regPattern.exec(content)) {
    let email = {
      email: matchResult[1],
      password: matchResult[2]
    }
    emails.push(email);
  }

  await fs.writeFile(path.resolve(__dirname, './account.json'), JSON.stringify(emails, null, '    '), {encoding: 'utf-8'}, );
}

const main = async () => {
  const accounts = JSON.parse(await fs.readFile(path.resolve(__dirname, './account.json')));
  for (const account of accounts) {
    console.log(`正在帮账号: ${JSON.stringify(account)}刷题`);
    await registerAndStart(account);
  }
}

if (require.main === module) {
  // dealEmails();
  main();
} else {
  module.exports = {}
}
