const puppeteer = require('puppeteer');
const faker = require('faker');
const time = require('../util/time');


const registerAndStart = async (account) => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const registerPageUrl = 'https://nvidia.qwiklab.com/users/sign_up?locale=en'
  const page = await browser.newPage();
  await page.goto(registerPageUrl);

  let registerButton = await page.$('body > div > div.join__button > div');
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
  await page.waitForNavigation({ timeout: 3000 })

  const warningPanel = await page.$('#new_user > div.alert.alert-error');
  if (warningPanel) {
    console.log('该账号已经被注册');
    console.log('登入中.....');
    const signUpUrl = 'https://nvidia.qwiklab.com/users/sign_in?locale=en';
    await page.goto(signUpUrl);

    const emailLoginButton = await page.$('body > div > div.join__button > div');
    await emailLoginButton.click();

    await page.type('#user_email', account.email);
    await page.type('#user_password', account.password);

    const rememberCheck = await page.$('#user_remember_me');
    await rememberCheck.click();

    const loginButton = await page.$('#new_user > div.form-actions > input');
    await loginButton.click();
    await page.waitForNavigation({timeout: 3000})
  } else {
    console.log('注册成功');
  }

  
  console.log('正在进入免费课程页面...');
  const courseUrl = 'https://nvidia.qwiklab.com/focuses/12?parent=catalog'
  await page.goto(courseUrl);
  const startLabButtonSelector = 'a.button.button--start.button--lab.js-start-lab-button';
  await page.waitForSelector(startLabButtonSelector)
  const startLabButton = await page.$(startLabButtonSelector);
  if (startLabButton) {
    try {
      console.log('即将开始...');
    await startLabButton.click();
    }catch (e) {
      console.error(e);
      console.log('可能已开始...');
    }
  }
  
  console.log('2小时后自动关闭窗口');
  const leftTimeButtonSelector = 'h3.text--sign.js-timer';
  await page.waitForSelector(leftTimeButtonSelector);

  setTimeout(() => {
    browser.close().then().catch(() => console.log('关闭浏览器出错'));
  }, 1000 * 60 * 60 * 2);

  setInterval(() => {
    page.evaluate((selector) => {
      const button = document.querySelector('h3.text--sign.js-timer');
      return button.innerText;
    }, leftTimeButtonSelector).then((text) => console.log(`账号${JSON.stringify(account)}剩余时间${text}`));
  }, 5 * 1000)
};

if (require.main === module) {
  register();
} else {
  module.exports = registerAndStart
}