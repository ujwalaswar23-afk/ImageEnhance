import React from 'react'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { Button } from './components/ui/button'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
import ImageUploader from './components/ImageUploader'
import backgroundImage from './5073414.jpg'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function AppContent() {
  return (
    <div 
      className="min-h-screen bg-background transition-colors relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AI Image Enhancer BY UJWAL ASWAR</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Enhance Your Images with AI By Ujwal Aswar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any image and let our AI enhance it to stunning 4K and 8K resolution
            while removing noise and improving clarity.
          </p>
        </div>

        <ImageUploader />

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">AI Enhancement</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI algorithms enhance image quality and remove artifacts
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-primary font-bold text-lg">4K</span>
            </div>
            <h3 className="font-semibold">4K & 8K Upscaling</h3>
            <p className="text-sm text-muted-foreground">
              Upscale your images to professional 4K and 8K resolution
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Noise Reduction</h3>
            <p className="text-sm text-muted-foreground">
              Remove distortion, noise, and artifacts while preserving details
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Image Enhancer 4k AND 8k . Powered by Ujwal Aswar.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-image-enhancer-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App