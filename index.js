const request = require('request');
const cheerio = require('cheerio');
const authors = require('./authors');
const fs = require('fs');

const results = [];

authors
  .filter((a, i) => i <= 1)
  .forEach((author) => {
    const author_id = author.replace(' ', '_').toLocaleLowerCase();
    request(`https://www.pensador.com/autor/${author_id}`, (err, response, html) => {
      if (err) {
        console.log('Erro');
      }

      if (!err && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const authorTotal = $('.autorTotal');
        const totalThoughts = authorTotal.children().last().text();

        const pagination = parseInt(totalThoughts / 25 + 1);

        for (let i = 1; i < 2; i++) {
          request(`https://www.pensador.com/autor/${authorTotal[0]}/${i}`, (error, res, html2) => {
            const $ = cheerio.load(html);
            const phrase = $('.frase');

            phrase.each((i, p) => {
              results.push({ author, author_id, phrase: p.childNodes[0].data });
            });

            fs.writeFileSync('./results.json', JSON.stringify(results));
          });
        }
      }
    });
  });
