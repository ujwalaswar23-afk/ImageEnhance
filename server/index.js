import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  }
});

// Store processing status
const processingStatus = new Map();

// Helper function to enhance image using Sharp (for initial processing)
async function preprocessImage(inputPath, outputPath, targetWidth) {
  try {
    await sharp(inputPath)
      .resize(targetWidth, null, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false
      })
      .sharpen(1, 1, 2)
      .modulate({
        brightness: 1.02,
        saturation: 1.05,
        hue: 0
      })
      .jpeg({ quality: 95, progressive: true })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw error;
  }
}

// Helper function to simulate AI enhancement (placeholder for actual AI processing)
async function enhanceImageWithAI(imagePath, targetResolution) {
  try {
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    
    // For demonstration, we'll use Sharp for upscaling and enhancement
    // In a real implementation, you would integrate with actual AI models
    const targetWidth = targetResolution === '4K' ? 3840 : 7680;
    
    const enhancedBuffer = await sharp(imageBuffer)
      .resize(targetWidth, null, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: false
      })
      .sharpen(1.5, 1, 3)
      .modulate({
        brightness: 1.03,
        saturation: 1.08,
        hue: 0
      })
      .normalize()
      .jpeg({ quality: 98, progressive: true })
      .toBuffer();
    
    return enhancedBuffer;
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw error;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Upload and process image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const inputPath = req.file.path;
    
    // Initialize processing status
    processingStatus.set(fileId, {
      status: 'processing',
      progress: 0,
      originalFile: req.file.filename,
      results: {}
    });

    // Start async processing
    processImageAsync(fileId, inputPath, req.file.filename);

    res.json({
      fileId,
      message: 'Upload successful. Processing started.',
      originalFilename: req.file.originalname
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Async image processing function
async function processImageAsync(fileId, inputPath, filename) {
  try {
    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Update progress
    processingStatus.set(fileId, {
      ...processingStatus.get(fileId),
      progress: 25,
      status: 'enhancing_4k'
    });

    // Process 4K version
    const enhanced4K = await enhanceImageWithAI(inputPath, '4K');
    const output4KPath = path.join(outputDir, `${fileId}_4K.jpg`);
    await fs.writeFile(output4KPath, enhanced4K);

    // Update progress
    processingStatus.set(fileId, {
      ...processingStatus.get(fileId),
      progress: 75,
      status: 'enhancing_8k'
    });

    // Process 8K version
    const enhanced8K = await enhanceImageWithAI(inputPath, '8K');
    const output8KPath = path.join(outputDir, `${fileId}_8K.jpg`);
    await fs.writeFile(output8KPath, enhanced8K);

    // Complete processing
    processingStatus.set(fileId, {
      ...processingStatus.get(fileId),
      progress: 100,
      status: 'completed',
      results: {
        '4K': `${fileId}_4K.jpg`,
        '8K': `${fileId}_8K.jpg`
      }
    });

    // Clean up original file
    await fs.unlink(inputPath);

  } catch (error) {
    console.error('Processing error:', error);
    processingStatus.set(fileId, {
      ...processingStatus.get(fileId),
      status: 'error',
      error: error.message
    });
  }
}

// Get processing status
app.get('/api/status/:fileId', (req, res) => {
  const { fileId } = req.params;
  const status = processingStatus.get(fileId);
  
  if (!status) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.json(status);
});

// Download enhanced image
app.get('/api/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'output', filename);
    
    // Check if file exists
    await fs.access(filePath);
    
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      }
    });
    
  } catch (error) {
    console.error('File access error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Serve enhanced images
app.get('/api/image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'output', filename);
    
    await fs.access(filePath);
    res.sendFile(filePath);
    
  } catch (error) {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`📁 Output directory: ${path.join(__dirname, 'output')}`);
  console.log(`🤖 Gemini AI integration: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled'}`);
});