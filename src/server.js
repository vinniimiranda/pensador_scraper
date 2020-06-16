import express from 'express';
import cors from 'cors';

import Author from './schemas/Author';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());


app.get('/authors', async (req, res) => {
  const authors = await Author.find({}).sort({
    name: 1
  })
  const cleanAuthors = authors.map((author) => ({ name: author.name, slug: author.slug, id: author.id, image_url: author.image_url }))
  res
    .status(200)
    .json(cleanAuthors);
});


app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;

  const author = await Author.findById(id)

  res.status(200).json(author);
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
