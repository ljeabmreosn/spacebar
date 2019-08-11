import { Schema, model } from 'mongoose';


const PlayerSchema = new Schema({
  id: String,
  name: String,
  score: Number,
}, {
  autoIndex: false,
});

const MongoPlayer = model('Player', PlayerSchema);

export default MongoPlayer;