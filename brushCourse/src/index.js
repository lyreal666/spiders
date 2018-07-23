/*
 * @Author: ytj 
 * @Date: 2018-07-23 08:27:47 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-23 23:54:34
 */

"use strict";

const fs = require('mz/fs');
const path = require('path');
const register = require('./register');
const start = require('./start');
const log4js = require('./configLog');

const l2f = log4js.getLogger('normalLog');
const e2f = log4js.getLogger('errorLog');

const dealEmails = async () => {
    const content = await fs.readFile(path.resolve(__dirname, './emails.txt'), {
        encoding: 'utf-8'
    });
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

    await fs.writeFile(path.resolve(__dirname, './account.json'), JSON.stringify(emails, null, '    '), {
        encoding: 'utf-8'
    }, );
}

const main = async () => {
    const accounts = JSON.parse(await fs.readFile(path.resolve(__dirname, './account.json')));
    for (const account of accounts) {
        l2f.info(`正在处理账号: ${account.email} 刷课任务`);
        try {
            let {
                browser,
                page,
            } = await register(account);
            await start(browser, page, account);
        } catch(e) {
            e2f.info(`处理账号${account.email}时出现异常`)
            e2f.error(e);
        }
    }
}

if (require.main === module) {
    // dealEmails();
    main();
} else {
    throw Error('这是程序入口, 不可被当作模块使用');
}