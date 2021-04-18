const request = require('request-promise');
const cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

// const URL = 'https://www.adorocinema.com/filmes/filme-221542/';
const URLS = [
    'https://www.imdb.com/title/tt0102926/', 
    'https://www.imdb.com/title/tt2267998/'
];

(async () => {
    let moviesData = [];
    for(let movie of URLS){
        const response = await request({
            uri: movie,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'cache-control': 'max-age=0',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
            },
            gzip: true,
        });
        let $ = cheerio.load(response);

        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('div[class="ratingValue"] > strong > span').text();
        let poster = $('div[class="poster"] > a > img').attr('src');
        let totalRatings = $('div[class="imdbRating"] > a').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();

        let genres = [];
        $('div[class="title_wrapper"] a[href^="/search/title?genres="]').each((i, elm) => {
            let genre = $(elm).text();
            genres.push(genre);
        });

        moviesData.push({
            title,
            rating,
            poster,
            totalRatings,
            releaseDate,
            genres
        })

        // console.log(`title: ${title}`);
        // console.log(`rating: ${rating}`);
        // console.log(`poster: ${poster}`);
        // console.log(`totalRatings: ${totalRatings}`);
        // console.log(`releaseDate: ${releaseDate}`);
        // console.log(`genres: ${genres}`);
    }
    
    const fields = ['title', 'rating', 'poster', 'totalRatings', 'releaseDate', 'genres'];
    
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(moviesData); 

    fs.writeFileSync('./data.csv', csv, 'utf-8');

    console.log(csv);
    
})()