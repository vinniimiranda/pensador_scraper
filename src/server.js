import express from 'express';
import cors from 'cors';

import Author from './schemas/Author';
import Phrase from './schemas/Phrase';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());


app.get('/authors', async (req, res) => {
  const authors = await Author.find({})
  res
    .status(200)
    .json(authors);
});


app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;
  const author = await Author.findById(id);
  const count = await Phrase.countDocuments({ author_id: id });
  const phrases = await Phrase.find({ author_id: id }).limit(10);

  res.status(200).json({ author, phrases, count });
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
