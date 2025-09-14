import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, X, Download, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import axios from 'axios'

interface ProcessingStatus {
  status: string
  progress: number
  results?: {
    '4K': string
    '8K': string
  }
  error?: string
}

interface UploadedFile {
  file: File
  preview: string
  id: string
}

const ImageUploader: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [fileId, setFileId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      const id = Math.random().toString(36).substr(2, 9)
      setUploadedFile({ file, preview, id })
      setProcessingStatus(null)
      setFileId(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  const uploadAndProcess = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('image', uploadedFile.file)

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const newFileId = uploadResponse.data.fileId
      setFileId(newFileId)

      // Poll for status updates
      const pollStatus = async () => {
        try {
          const statusResponse = await axios.get(`/api/status/${newFileId}`)
          const status = statusResponse.data
          setProcessingStatus(status)

          if (status.status === 'completed') {
            setIsProcessing(false)
          } else if (status.status === 'error') {
            setIsProcessing(false)
          } else {
            setTimeout(pollStatus, 1000)
          }
        } catch (error) {
          console.error('Status polling error:', error)
          setIsProcessing(false)
        }
      }

      pollStatus()

    } catch (error) {
      console.error('Upload error:', error)
      setIsProcessing(false)
      setProcessingStatus({
        status: 'error',
        progress: 0,
        error: 'Upload failed. Please try again.'
      })
    }
  }

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    setUploadedFile(null)
    setProcessingStatus(null)
    setFileId(null)
    setIsProcessing(false)
  }

  const downloadImage = (resolution: '4K' | '8K') => {
    if (processingStatus?.results?.[resolution]) {
      const filename = processingStatus.results[resolution]
      window.open(`/api/download/${filename}`, '_blank')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the image here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop an image here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, WebP up to 50MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Preview */}
      {uploadedFile && (
        <div
          className="bg-card rounded-lg border shadow-sm overflow-hidden"
        >
          <div className="relative">
            <img
              src={uploadedFile.preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-primary" />
                <span className="font-medium">{uploadedFile.file.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            {!isProcessing && !processingStatus && (
              <Button onClick={uploadAndProcess} className="w-full" size="lg">
                <Zap className="w-4 h-4 mr-2" />
                Enhance with AI
              </Button>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {processingStatus?.status === 'enhancing_4k' && 'Creating 4K version...'}
                    {processingStatus?.status === 'enhancing_8k' && 'Creating 8K version...'}
                    {processingStatus?.status === 'processing' && 'Processing image...'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {processingStatus?.progress || 0}%
                  </span>
                </div>
                <Progress value={processingStatus?.progress || 0} />
              </div>
            )}

            {/* Results */}
            {processingStatus?.status === 'completed' && processingStatus.results && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Enhancement completed!</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => downloadImage('4K')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download 4K
                  </Button>
                  <Button
                    onClick={() => downloadImage('8K')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download 8K
                  </Button>
                </div>
              </div>
            )}

            {/* Error State */}
            {processingStatus?.status === 'error' && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">
                  {processingStatus.error || 'Processing failed. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader