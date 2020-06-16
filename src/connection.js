import Mongoose from 'mongoose'
import 'dotenv/config'

class Connection {
    MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/smart'
    constructor() {
        Mongoose.connect(this.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Connected to mongo'));
    }
}

export default new Connection();
