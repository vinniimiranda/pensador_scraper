import { Schema, model } from 'mongoose'
import '../connection'

const PhraseSchema = new Schema({
    author_id: String,
    lang: String,
    value: String
})

const Phrase = model('Phrase', PhraseSchema);

export default Phrase