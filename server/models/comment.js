import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: 'String', required: true },
  message: { type: 'String', required: true },
  postCuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Comment', commentSchema);
