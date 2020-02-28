const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    theme: { type: Types.ObjectId, ref: 'Theme' },
    from: { type: Types.ObjectId, ref: 'User' },
    to: { type: Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    status: { type: String, required: true, default: 'Активная' }
});


module.exports = model('Task', schema);