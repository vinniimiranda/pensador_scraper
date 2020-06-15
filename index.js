const request = require('request');
const cheerio = require('cheerio');
const authors = require('./authors');
const fs = require('fs');

authors
  .filter((a, i) => i === 0)
  .forEach((author) => {
    request(`https://www.pensador.com/autor/${author}`, (err, response, html) => {
      if (err) {
        console.log('Erro');
      }

      if (!err && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const results = [];

        const authorTotal = $('.autorTotal');
        const totalThoughts = authorTotal.children().last().text();

        const pagination = parseInt(totalThoughts / 25 + 1);

        for (let i = 1; i < pagination + 1; i++) {
          request(`https://www.pensador.com/autor/${authorTotal[0]}/${i}`, (error, res, html2) => {
            const $ = cheerio.load(html);
            const phrase = $('.frase');

            phrase.each((i, p) => {
              results.push({ author: author, phrase: p.childNodes[0].data });
            });

            fs.writeFileSync('./results.json', JSON.stringify(results));
          });
        }
      }
    });
  });
