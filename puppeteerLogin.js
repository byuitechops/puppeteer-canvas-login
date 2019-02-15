const puppeteer = require('puppeteer');
const userNameInput = '#pseudonym_session_unique_id';
const passWordInput = '#pseudonym_session_password';
const button = 'button[type=submit]';
var browser;

async function login(inputs) {
    // set the view window for puppeteer
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1900,
            height: 1080
        },
        args: ['--start-maximized'],
        // args: ['--start-maximized', '--debug-devtools'],
        // devtools: true
    });

    // There is always a tab made so just use that one
    var pages = await browser.pages();
    var page = pages[0];


    // go to the canvas login and input the login and password
    await page.goto('https://byui.instructure.com/login/canvas', {
        waitUntil: ['load', 'domcontentloaded']
    });

    await page.waitForSelector(userNameInput)
    await page.type(userNameInput, inputs.userName);
    await page.type(passWordInput, inputs.passWord);

    //click the log in button and wait for it to finish logging in before we return
    await Promise.all([page.waitForSelector('.ic-Dashboard-header__title'), page.click(button)]);
    return page;
}

// close the browser, killing the session when done.
async function logout() {

    await browser.close();

}

// closes the specified page
// NOTE: be sure to logout even if there is only a single page. This ensures the browser is closed as well.
async function closePage(page) {
    await page.close();
}

async function newPage() {
    return await browser.newPage();
}

module.exports = {

    login: login,
    logout: logout,
    closePage: closePage,
    newPage: newPage
}