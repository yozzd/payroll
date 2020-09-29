const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { genSalt, hash, compare } = require('bcrypt');

const UserSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  username: String,
  password: String,
  role: String,
}, { timestamps: true });

UserSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  return next();
});

UserSchema.methods = {
  async authenticate(password) {
    const pwgen = await compare(password, this.password);
    if (pwgen) {
      return true;
    }
    return false;
  },
};

module.exports = model('User', UserSchema, 'user');
