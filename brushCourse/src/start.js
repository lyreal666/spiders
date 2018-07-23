/*
 * @Author: ytj 
 * @Date: 2018-07-23 21:48:00 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-23 23:23:26
 */

const log4js = require('./configLog');

const l2f = log4js.getLogger('normalLog');
const e2f = log4js.getLogger('errorLog');
const cp2f = log4js.getLogger('completedCourse');

const start = async (browser, page, account) => {
    l2f.info('正在进入免费课程页面...');
    const courseUrl = 'https://nvidia.qwiklab.com/focuses/12?parent=catalog'
    await page.goto(courseUrl);
    const startLabButtonSelector = 'a.button.button--start.button--lab.js-start-lab-button';
    await page.waitForSelector(startLabButtonSelector)
    const startLabButton = await page.$(startLabButtonSelector);
    if (startLabButton) {
        try {
            l2f.info('即将开始...');
            await startLabButton.click();
        } catch (e) {
            e2f.error(e);
            l2f.info('可能已开始...');
        }
    }

    l2f.info('2小时后自动关闭窗口');
    setTimeout(() => {
        browser.close().then().catch(() => l2f.info('关闭浏览器出错, 账号'));
    }, 1000 * 60 * 60 * 2);


    const evalFunc = (selector) => {
        const button = document.querySelector('h3.text--sign.js-timer');
        return button.innerText;
    };

    const resolvedFunc = (text) => {
        if (text === '00:00:00') {
            const completePath = path.resolve(__dirname, './completedAccounted.txt');
            cp2f.info(`账号${account.email}已经完成`);
            browser.close().then().catch(() => l2f.info('关闭浏览器出错, 账号'));
        } else {
            l2f.info(`账号${account.email}剩余时间${text}`);
        }
    };
    
    const leftTimeButtonSelector = 'h3.text--sign.js-timer';
    await page.waitForSelector(leftTimeButtonSelector);
    setInterval(() => page.evaluate(evalFunc, leftTimeButtonSelector).then(resolvedFunc), 1000 * 30);
}

if (require.main === module) {
    start();
} else {
    module.exports = start
}