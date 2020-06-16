import { Schema, model } from 'mongoose'
import '../connection'

const AuthorSchema = new Schema({
    name: String, slug: String, image_url: String, phrases: {
        pt: [],
        en: []
    }
})

const Author = model('Author', AuthorSchema);

export default Author