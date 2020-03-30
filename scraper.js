const request = require('request');
const cheerio = require('cheerio');
const HTMLParser = require('node-html-parser');
const iconvLite = require('iconv-lite');
const iconv = require('iconv'); 

//https://www.povarenok.ru/recipes/category/index/~pageNumber/
// const categoriesNumber = [2, 6, 12, 15, 19, 23, 25, 30, 35, 228, 227, 55, 187, 247, 289, 308, 356];
// const pageCount = 50;

const categoriesNumber = [2];
const pageCount = 2;

var items = [];

categoriesNumber.forEach((index) => {
    console.log('index = ' + index);
    parseRecipeItem('https://www.povarenok.ru/recipes/show/44035/');
    

    //TODO uncomment it
    // for (let i = 1; i <= pageCount; i++) { 
    //     var uri = 'https://www.povarenok.ru/recipes/category/' + index + '/~' + i + '/';
    //     parseItemListPage(uri);
    // }
});

function parseItemListPage(uri) {
    const jsonParam = {
        uri: uri,
        encoding: null
    }
    request(jsonParam, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $('.item-bl').each((i, el) => {

                const itemUrl = $(el)
                                .find('div', '.m-img.desktop-img.conima')
                                .find('a')
                                .attr('href');

                parseRecipeItem(itemUrl);
                                
            });
        }
    });
}

function parseRecipeItem(itemUrl) {
    const jsonParam = {
        uri: itemUrl,
        encoding: null
    }

    request(jsonParam, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(readRussianChars(html), { decodeEntities: true });

            const articleName = $('h1').text();

            const articleImageUrl = $('div.m-img')
                                    .find('img')
                                    .attr('src');

            const comment = $('div.article-text').find('p').text()

            const categoties = parseCategories(html)
            const kitchen = parseKitchen(html)
            const countOfPorcion = $('div.ingredients-bl').find('p').text()
            const ingridients = parseIngridients(html)

            const tabel = $('div#nae-value-bl').html();
            const cookSteps = $('div.cooking-bl').html();
            const bottomTags = $('dev.tab-content').html();


            console.log('articleName = ' + articleName);
            console.log('articleImageUrl = ' + articleImageUrl)
            console.log('categoties = ' + categoties)
            console.log('kitchen = ' + kitchen)
            console.log('countOfPorcion = ' + countOfPorcion)
            
            for (var entry of ingridients.entries()) {
                var key = entry[0],
                    value = entry[1];
                console.log(key + " = " + value);
            }
            // console.log('comment = ' + comment)

            console.log('load uri =' + itemUrl + ' is done!')
            console.log('======================================================================\n\n')
        } else {
            console.log('error =' + error);
        }
    });
}

function parseIngridients(html) {
    var ingridients = new Map();
    const $ = cheerio.load(readRussianChars(html), { decodeEntities: true });
    $('div.ingredients-bl').find('ul').each((i, el) => {

        $(el).find('li').each((i1, el1) => {
            const ingredient = $(el1).find('span').find('a').find('span').text()

            var value = ''
           
            if($(el1).find('span').find('span').length) {
                const temp = $(el1).find('span').find('span');
                value = $(temp[1]).text();
            }

            ingridients.set(ingredient, value); 
        });
    });

    return ingridients;
}

function parseKitchen(html) {
    var kitchen = null;
    const $ = cheerio.load(readRussianChars(html), { decodeEntities: true });
    $('div.article-breadcrumbs').each((i, el) => {

        const items = $(el).find('p');
        if(items.length > 1) {
            kitchen = $(items[1]).find('span').find('a').text()
        }
    });

    return kitchen;
}

function parseCategories(html) {
    var categories = [];

    const $ = cheerio.load(readRussianChars(html), { decodeEntities: true });
    $('div.article-breadcrumbs').each((i, el) => {

        const items = $(el).find('p');

        if(items.length > 1) {
            const category = $(items[0]).find('span').find('a').each((i, el) => {
                categories.push($(el).text())
            });

        } else {
            const category = $(items).find('span').find('a').each((i, el) => {
                categories.push($(el).text())
            });
        }


    });

    return categories;
}

function readRussianChars(html) {
    return iconvLite.encode(iconvLite.decode(html, 'windows-1251'), 'utf8').toString()
}