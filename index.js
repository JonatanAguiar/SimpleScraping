const request = require('request-promise');
const cheerio = require('cheerio');

const URl = 'https://www.adorocinema.com/filmes/filme-221542/';
//const URl = 'https://www.imdb.com/title/tt0102926/?ref_=nv_1';

(async () => {
    const response = await request(URl);
    let $ = cheerio.load(response);

    // let title = $('div[class="title_wrapper"] > h1').text();
    let title = $('div[class="section-wrap breadcrumb "] > h1[class="item"]').text();
    let releaseDate = $('span[class="ACrL2ZACrpbG1lcy9hZ2VuZGEvd2Vlay0yMDIxLTA3LTIyLw== date blue-link"]').text();

    console.log(title.trim());
    console.log(releaseDate.trim());
})()