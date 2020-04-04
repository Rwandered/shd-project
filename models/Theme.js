const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  theme: { type: String, required: true, },
  executor: [{ type: Types.ObjectId, ref: 'User' }]
});


module.exports = model('Theme', schema);