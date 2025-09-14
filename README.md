# 🚀 AI Image Enhancer

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern web application that uses AI to enhance and upscale images to 4K and 8K resolution while removing noise and artifacts. Built by **Ujwal Aswar**.

## ✨ Features

### 🎯 **Core Functionality**
- **Drag & Drop Upload**: Easy image upload with preview (supports JPG, PNG, WebP up to 50MB)
- **AI Enhancement**: Powered by Google Gemini API for intelligent image processing
- **4K & 8K Upscaling**: Automatic enhancement to both high resolutions
- **Noise Reduction**: Advanced algorithms remove distortion, noise, and artifacts
- **Download Options**: Separate download buttons for 4K and 8K versions

### 🎨 **User Experience**
- **Modern UI**: Clean, minimalistic design with beautiful background
- **Dark/Light Mode**: Elegant theme toggle with smooth transitions
- **Progress Tracking**: Real-time progress bar and status updates
- **Before/After Preview**: Visual comparison of original vs enhanced images
- **Responsive Design**: Mobile-friendly layout for all devices
- **Error Handling**: Comprehensive error states and user feedback

### 🛠 **Technical Features**
- **React 18** with TypeScript for type safety
- **TailwindCSS** for modern styling
- **Node.js/Express** backend with secure file handling
- **Google Gemini AI** integration for image enhancement
- **Sharp** library for high-quality image processing
- **Real-time Status** tracking with WebSocket-like polling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ujwalaswar23-afk/ImageEnhance.git
   cd ImageEnhance
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3001
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # UI components (Button, Progress)
│   │   │   ├── ImageUploader.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
├── server/                # Node.js backend
│   ├── uploads/          # Temporary uploaded files
│   ├── output/           # Enhanced images
│   ├── .env             # Environment variables
│   └── index.js         # Server entry point
└── package.json          # Root package file
```

## 🔧 Development

### Frontend Only
```bash
npm run dev:client
```

### Backend Only
```bash
npm run dev:server
```

### Build for Production
```bash
npm run build
```

## 📡 API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/upload` - Upload image for processing
- `GET /api/status/:id` - Check processing status
- `GET /api/download/:filename` - Download enhanced image
- `GET /api/image/:filename` - Serve enhanced images

## 🔑 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

## 🎨 Screenshots

### Main Interface
- Beautiful background with glass-morphism effects
- Drag & drop upload area
- Real-time progress tracking

### Processing Flow
1. Upload image via drag & drop
2. AI processes and enhances the image
3. Download 4K and 8K versions
4. Compare before/after results

## 🛡️ Security Features

- **File Validation**: Only allows JPG, PNG, WebP formats
- **Size Limits**: Maximum 50MB file uploads
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers for Express
- **Input Sanitization**: Clean file handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the `server` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ujwal Aswar**
- GitHub: [@ujwalaswar23-afk](https://github.com/ujwalaswar23-afk)

## 🙏 Acknowledgments

- Google Gemini AI for image enhancement capabilities
- React team for the amazing framework
- TailwindCSS for beautiful styling
- Sharp library for image processing

---

<div align="center">
  <p>Made with ❤️ by Ujwal Aswar</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>