import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    customProperties: [{ title: String, fallback: String }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const List = mongoose.model('List', listSchema);

export default List;