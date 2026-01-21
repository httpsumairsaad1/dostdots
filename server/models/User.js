import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google Login
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },

  // Wallpaper Configuration Data
  phone_model: { type: String, default: '' },
  mode: { type: String, default: 'YEAR' }, // 'LIFE', 'YEAR', 'HARD75'
  theme_name: { type: String, default: '' },
  daily_update_time_wallpaper: { type: String, default: '00:01' },
  link_generate_time: { type: Date },
  dot_style: { type: String, default: 'square' },
  inspiration: { type: String, default: 'none' } // 'none', 'quote', 'quran'
}, { timestamps: true });

export default mongoose.model('User', userSchema);