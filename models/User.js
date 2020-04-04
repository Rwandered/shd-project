const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, default: 'User name' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  tasks: [{ type: Types.ObjectId, ref: 'Task' }]
});


module.exports = model('User', schema);