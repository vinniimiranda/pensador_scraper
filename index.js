const axios = require('axios');
const cheerio = require('cheerio');
const authors = require('./authors');
const fs = require('fs');

const results = [];

(async function () {
  for await (const author of authors) {
    const author_id = author.replace(' ', '_').toLocaleLowerCase();
    const { data } = await axios.get(`https://www.pensador.com/autor/${author_id}`);

    const $ = cheerio.load(data);

    const authorTotal = $('.autorTotal');
    const totalThoughts = authorTotal.children().last().text();
    const pagination = parseInt(totalThoughts / 25 + 1);

    for (let i = 1; i < pagination + 1; i++) {
      const { data: html } = await axios.get(`https://www.pensador.com/autor/${author}/${i}`);
      const $ = cheerio.load(html);
      const phrase = $('.frase');

      phrase.each((i, p) => {
        results.push({ author, author_id, phrase: p.childNodes[0].data });
      });
    }

    fs.writeFileSync('./results.json', JSON.stringify(results));
  }
})();
