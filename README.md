# dostdots

**Visualize Time.**
Review your progress each day and view it on your wallpaper. Dostdots is a minimalist, data-driven wallpaper generator that integrates with your phone's native automation tools to keep you focused.

## Features

- **Visualization Modes**:
  - **Life**: Memento Mori graph (80 years in weeks).
  - **Year**: Daily progress of the current year.
  - **75 Hard**: Track the 75 Hard challenge.
- **AI Integration**: Fetches daily motivational quotes or Quran verses using Google Gemini API.
- **Deep Customization**: 15+ Themes and 8+ Icon shapes (Stars, Fire, Crypto, etc.).
- **Secure Authentication**:
  - Email Verification via Nodemailer (Gmail).
  - Google Login support.
  - User configuration cloud storage.
- **Zero-Friction**: No mobile app required. Works via URL generation and native OS automation (iOS Shortcuts / Android MacroDroid).

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Nodemailer.
- **AI**: Google Gemini SDK (`@google/genai`).

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Connection string
- Google Gemini API Key
- Gmail Account (for sending verification emails) + App Password

## Getting Started

### 1. Backend Setup (Server)

The backend handles authentication, email verification, and user configuration storage.

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install express mongoose cors nodemailer
   ```

3. Configure Credentials:
   Open `server/index.js` and update the following configuration section:
   ```javascript
   const GMAIL_USER = 'your-email@gmail.com';
   const GMAIL_APP_PASSWORD = 'your-app-password'; // Get from Google Account > Security > App Passwords
   const MONGO_URI = "your-mongodb-connection-string";
   ```

4. Run the server:
   ```bash
   node index.js
   ```
   The backend will start on `http://localhost:3001`.

### 2. Frontend Setup (Client)

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application typically runs on `http://localhost:5173`.

## Usage Guide

1. **Sign Up**: Create an account. You will receive a verification email to activate your account.
2. **Configure**:
   - Select your device model.
   - Choose a visualization mode (Life, Year, etc.).
   - Pick a theme and dot style.
   - (Optional) Enable AI quotes.
3. **Generate**: Click the "Copy Wallpaper URL" button.
4. **Install**:
   - Go to the **Install** tab in the app.
   - Follow the platform-specific guide (iOS or Android) to set up automation that fetches the generated URL daily.

## Project Structure

- `/components`: React UI components (Auth, PhonePreview, WallpaperContent, etc.).
- `/server`: Node.js/Express backend API.
- `/services`: Helper services (Gemini AI integration).
- `/types.ts`: TypeScript definitions and Theme constants.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user & send verification email |
| `POST` | `/api/auth/verify` | Verify user email token |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/google` | Authenticate via Google |
| `POST` | `/api/user/save-config` | Save wallpaper configuration |

## License

MIT