const Mongoose = require('mongoose');
const userSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

Mongoose.model('User', userSchema);

module.exports = Mongoose.model('User');
