const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Хэрэглэгчийн нэр оруулна уу'],
    unique: true,
    trim: true,
    minlength: [3, 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байх ёстой']
  },
  email: {
    type: String,
    required: [true, 'Имэйл хаяг оруулна уу'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Хүчинтэй имэйл хаяг оруулна уу']
  },
  password: {
    type: String,
    required: [true, 'Нууц үг оруулна уу'],
    minlength: [6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой']
  },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  likedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
}, { timestamps: true });

// Hash password only if modified/new
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);