import axios from 'axios';
import cheerio from 'cheerio';

import Author from './schemas/Author';
import Phrase from './schemas/Phrase';


async function ScrapeAndSave () {
  const authors = await Author.find({})
  if (authors.length === 0) {
    return await ScrapeAuthorAndSaveOnDatabase()
  }

  for await (const author of authors) {

    const phrases = await ScrapPensador(author.slug);

    for await (const phrase of phrases) {
      const created = await Phrase.create({
        author_id: author._id,
        lang: 'pt-br',
        value: phrase
      })
      console.log(created);
    }

  }

  process.exit();
}

async function ScrapPensador (author_id) {
  const allPhrases = []

  const { data } = await axios.get(`https://www.pensador.com/autor/${author_id}/1`);
  const $ = cheerio.load(data);

  const total = $('.total').children().last().text() || $('.autorTotal').children().last().text();

  const pagination = parseInt(total / 25 + 1);

  for (let i = 1; i <= pagination; i++) {
    const { data } = await axios.get(`https://www.pensador.com/autor/${author_id}/${i}`);
    const $ = cheerio.load(data);

    const phrases = $('.frase');
    phrases.toArray().forEach((phrase) => allPhrases.push(phrase.children[0].data))
  }


  return allPhrases;
}

async function ScrapeGoogleImages (author) {
  const { data: image } = await axios.get(
    `https://www.google.com/search?q=${author}&rlz=1C1GCEU_pt-BRBR898BR898&sxsrf=ALeKk03CZ-1Z5KdvzYXhLo3jHmNlPTHdGw:1592261526667&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjBr7619ITqAhXVH7kGHfwlAW8Q_AUoAXoECBcQAw&biw=1278&bih=959`
  );

  const CheerioImage = cheerio.load(image);
  const img = CheerioImage('img');
  const imgArray = img.toArray();
  const image_url = imgArray[1].attribs.src;

  return image_url;
}

async function ScrapeAuthorAndSaveOnDatabase () {
  const authors = [
    'Fernando Pessoa',
    'William Shakespeare',
    'Clarice Lispector',
    'Friedrich Nietzsche',
    'Augusto Cury',
    'Mario Quintana',
    'Pitagoras',
    'Confucio',
    'Haile Selassie',
    'Carlos Drummond de Andrade',
    'Dalai Lama',
    'Machado de Assis',
    'Roberto Shinyashiki',
    'Aristoteles',
    'Oscar Wilde',
    'Charles Chaplin',
    'Albert Einstein',
    'John Wooden',
    'D Elhers',
    'Fernando Teixeira de Andrade',
    'Gloria Hurtado',
    'Thich Nhat Hanh',
    'Paulo Coelho',
    'Platao',
    'Leonardo da Vinci',
    'Evelyn Beatrice Hall',
    'Geraldo Eustaquio de Souza',
    'Roger Bussy-Rabutin',
    'Joseph Addison',
    'Myrtes Mathias',
    'Georges Bernanos',
    'Lilian Tonet',
    'Socrates',
    'Nemo Nox',
    'Amyr Klink',
    'Cora Coralina',
    'Garth Henrichs',
    'Vinicius de Moraes',
    'Buda',
    'Sarah Westphal',
    'Seneca',
    'Santo Agostinho',
    'Millor Fernandes',
    'Martin Luther King',
    'Vladimir Maiakovski',
    'John Dryden',
    'Oliver Goldsmith',
    'Oswaldo Montenegro',
    'Maurice Switzer',
    'Waldemar Valle Martins',
    'Leon Tolstoi',
    'Jo Cooke',
    'Mahatma Gandhi',
    'Voltaire',
    'Henry Ford',
    'Sigmund Freud',
    'Benjamin Franklin',
    'Khalil Gibran',
    'Rui Barbosa',
    'Will Durant',
    'Soren Kierkegaard',
    'Elbert Hubbard'
  ]
  for await (const name of authors) {
    const slug = name.replace(/\s/g, '_').toLocaleLowerCase();
    const image_url = await ScrapeGoogleImages(name);

    const author = await Author.create({
      name,
      slug,
      image_url,
    })

    console.log(author);
  }
  ScrapeAndSave();

}

ScrapeAndSave()