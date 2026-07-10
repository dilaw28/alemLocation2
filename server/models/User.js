const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true, minlength: 6 },
    // Téléphone obligatoire — stocké avec indicatif pays
    countryCode:  { type: String, required: true, default: '+213' },  // indicatif ex: "+213"
    phone:        { type: String, required: true },                   // numéro sans indicatif
    whatsapp:     { type: String, default: '' },                      // numéro WhatsApp complet (peut être différent)
    address:      { type: String, default: '' },
    avatar:       { type: String, default: '' },
    role:         { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive:     { type: Boolean, default: true },
    licenseNumber:{ type: String, default: '' },
    licenseImage: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
