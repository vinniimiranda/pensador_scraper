const axios = require('axios');
const cheerio = require('cheerio');
const authors = require('./authors');
const fs = require('fs');

const results = [];

(async function () {
  for await (const author of authors) {
    const author_id = author.replace(/\s/g, '_').toLocaleLowerCase();

    const { data } = await axios.get(`https://www.pensador.com/autor/${author_id}/1`);
    const $ = cheerio.load(data);
    const phrase = $('.frase');

    phrase.each((i, p) => {
      results.push({ author, author_id, phrase: p.childNodes[0].data });
    });

    fs.writeFileSync('./results.json', JSON.stringify(results));
  }
})();
