const requests = require('superagent');
const cheerio = require('cheerio');
const util = require('util');
const path = require('path');
const fs = require('mz/fs');
const GetUrl = require('./getRealUrl');

let raw_url = `http://www.uyi2.com/albumMovieList?currentPage=%d&id=77`;

const crawl = async (currentPage=1) => {
    let url = encodeURI(util.format(raw_url, currentPage));
    const { text: html } = await requests.get(url);

    let $ = cheerio.load(html);
    const usefulScript = $('script')[0];
    const scriptStr = $(usefulScript).html();
    const evalObj = eval(scriptStr.replace('window.storage', 'global.storage'));

    const bookList = global.storage.albumMovieList.list;
    return bookList.map(element => {
        delete element.ishot;
        delete element.pic;
        return element;
    })
}


const main = async () => {
    let allBooks = [];
    const pageArray = Array.from({ length: 10}).map((element, index) => index + 1);
    for (let currentPage = 1; currentPage < 11; ++currentPage) {
        const bookList = await crawl(currentPage);
        allBooks.push(...bookList);
    }
    console.log(allBooks);
    const jsonPath = path.resolve(__dirname, './books.json');
    await fs.writeFile(jsonPath, JSON.stringify(allBooks, null, '    '));
}

if (require.main === module) {
   main();
} else {
    module.exports = {}
}