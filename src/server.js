import express from 'express';
import cors from 'cors';
import database from '../database.json';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());

app.get('/authors', (req, res) => {
  res
    .status(200)
    .json(database.map((item) => ({ author: item.author, author_id: item.author_id, image_url: item.image_url })));
});
app.get('/authors/:author_id', (req, res) => {
  const { author_id } = req.params;
  res.status(200).json(database.find((item) => (item.author_id = author_id)));
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
