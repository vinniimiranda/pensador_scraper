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

    const { data: image } = await axios.get(
      `https://www.google.com/search?q=${author}&rlz=1C1GCEU_pt-BRBR898BR898&sxsrf=ALeKk03CZ-1Z5KdvzYXhLo3jHmNlPTHdGw:1592261526667&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjBr7619ITqAhXVH7kGHfwlAW8Q_AUoAXoECBcQAw&biw=1278&bih=959`
    );

    const CheerioImage = cheerio.load(image);
    const img = CheerioImage('img');
    const imgArray = img.toArray();
    const image_url = imgArray[5].attribs.src;

    results.push({
      author,
      author_id,
      image_url,
      phrases: phrase.toArray().map((phrase) => phrase.children[0].data)
    });

    fs.writeFileSync('./results.json', JSON.stringify(results));
  }
})();
