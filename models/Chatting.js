const { Schema, model, Types } = require('mongoose');


const moveSchema = new Schema({
    howSender: { type: Types.ObjectId, ref: 'User' },
    howRecipient: { type: Types.ObjectId, ref: 'User' },
    messageBody: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
})

const schema = new Schema({
    task: { type: Types.ObjectId, ref: 'Task' },
    messages: [moveSchema]
});


module.exports = model('Chatting', schema);