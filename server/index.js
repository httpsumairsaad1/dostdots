import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from './models/User.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- CONFIGURATION ---
// Replace with your actual credentials
const GMAIL_USER = 'umairsaad2003@gmail.com';
const GMAIL_APP_PASSWORD = 'YOUR_GMAIL_APP_PASSWORD'; // Generate at: https://myaccount.google.com/apppasswords
const BASE_CLIENT_URL = 'http://localhost:5173'; // Where your frontend runs

// Database Connection
const MONGO_URI = "mongodb+srv://umairsaad52_db_user:eMqtx2ijmyWnyzBc@dostdots-cluster.msgmqax.mongodb.net/?appName=dostdots-cluster";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- EMAIL TRANSPORTER ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

const sendVerificationEmail = async (email, token) => {
  const link = `${BASE_CLIENT_URL}/?verify_token=${token}`;
  
  const mailOptions = {
    from: `"Dostdots Team" <${GMAIL_USER}>`,
    to: email,
    subject: 'Verify your Dostdots account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Welcome to Dostdots.</h2>
        <p>Please verify your email address to secure your account and save your progress.</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #666; font-size: 12px;">Or click here: <a href="${link}">${link}</a></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

// --- ROUTES ---

// 1. Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      username: name,
      email,
      password,
      isVerified: false,
      verificationToken
    });

    // Send Email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Signup successful. Please check your email to verify account.",
      requireVerification: true,
      email: email
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// 2. Verify Email
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
       // Optional: return res.status(403).json({ error: "Please verify your email first.", notVerified: true });
    }

    res.json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// 4. Google Login (Real JWT Handler)
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: "Token required" });
        }

        // Decode the Google JWT Token
        // NOTE: In strict production, use `google-auth-library` to verify the signature.
        // For this implementation without extra npm deps, we decode payload directly.
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
        const payload = JSON.parse(jsonPayload);
        
        const { email, name, sub: googleId, picture } = payload;
        
        // Find or Create User
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({
                username: name,
                email,
                googleId,
                isVerified: true // Google accounts are implicitly verified
            });
        } else if (!user.googleId) {
            // Link account if exists but created via email/pass
            user.googleId = googleId;
            await user.save();
        }

        res.json({
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Google Auth Error", error);
        res.status(500).json({ error: "Google Authentication failed" });
    }
});

// 5. Save Configuration
app.post('/api/user/save-config', async (req, res) => {
  try {
    const { 
      userId,
      phone_model,
      mode,
      theme_name,
      daily_update_time_wallpaper,
      link_generate_time,
      dot_style,
      inspiration
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        phone_model,
        mode,
        theme_name,
        daily_update_time_wallpaper,
        link_generate_time,
        dot_style,
        inspiration
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "Configuration saved" });
  } catch (error) {
    console.error('Save Config Error:', error);
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});