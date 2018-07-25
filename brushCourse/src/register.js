/*
 * @Author: ytj 
 * @Date: 2018-07-23 21:51:50 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-25 12:02:31
 */

"use strict";

const puppeteer = require('puppeteer');
const faker = require('faker');
const log4js = require('./configLog');

const l2f = log4js.getLogger('normalLog');

const register = async (account) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const registerPageUrl = 'https://nvidia.qwiklab.com/users/sign_up?locale=en'
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
    // const devices = require('puppeteer/DeviceDescriptors');
    // const iPhone = devices['iPhone 6'];
    // await page.emulate(iPhone)
    await page.goto(registerPageUrl);

    const registerButtonSelector = 'body > div > div.join__button > div';
    await page.waitForSelector(registerButtonSelector);
    let registerButton = await page.$(registerButtonSelector);
    await registerButton.click();

    const [firstName, lastName] = [faker.name.firstName(), faker.name.lastName()];

    await page.type('#user_first_name', firstName);
    await page.type('#user_last_name', lastName);
    await page.type('#user_email', account.email);
    await page.type('#user_company_name', '江西师范大学');
    await page.type('#user_password', account.password);
    await page.type('#user_password_confirmation', account.password)

    const submitButton = await page.$('#new_user > div.form-actions > input');
    await submitButton.click();
    await page.waitForNavigation({
        timeout: 6000,
        waitUntil: 'domcontentloaded'
    })

    const warningPanel = await page.$('#new_user > div.alert.alert-error');
    if (warningPanel) {
        l2f.info('该账号已经被注册');
        l2f.info('登入中.....');
        const signUpUrl = 'https://nvidia.qwiklab.com/users/sign_in?locale=en';
        await page.goto(signUpUrl, {
            timeout: 3000,
            waitUntil: 'domcontentloaded'
        });

        const emailLoginButton = await page.$('body > div > div.join__button > div');
        await emailLoginButton.click();

        await page.type('#user_email', account.email);
        await page.type('#user_password', account.password);

        const rememberCheck = await page.$('#user_remember_me');
        await rememberCheck.click();

        const loginButton = await page.$('#new_user > div.form-actions > input');
        await loginButton.click();
        await page.waitForNavigation({
            timeout: 6000,
            waitUntil: 'domcontentloaded'
        })
    } else {
        l2f.info('注册成功');
    }
    return {
        browser,
        page,
        account
    }
}

if (require.main === module) {
    register();
} else {
    module.exports = register
}