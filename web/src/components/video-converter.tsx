'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Video, Upload, Download, Settings, CheckCircle, AlertCircle, Database, Eye, EyeOff } from 'lucide-react'

interface ConversionResult {
  success: boolean
  originalFile: {
    name: string
    size: number
    type: string
    duration: string
  }
  convertedFile: {
    format: string
    quality: string
    estimatedSize: number
    bitrate: string
    resolution: string
    processingTime: string
  }
  downloadUrl: string
  message: string
  supabasePath?: string
}

export function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>('webm')
  const [quality, setQuality] = useState<string>('medium')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [supabaseBucket, setSupabaseBucket] = useState('videos')
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/mov': ['.mov'],
      'video/quicktime': ['.mov']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB limit
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    setIsConverting(true)
    setProgress(0)
    setError(null)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 500)

    try {
      const formData = new FormData()
      formData.append('video', selectedFile)
      formData.append('format', outputFormat)
      formData.append('quality', quality)

      const response = await fetch('/api/video-converter', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion')
    } finally {
      clearInterval(progressInterval)
      setIsConverting(false)
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'webm': return '🎬'
      case 'gif': return '🎭'
      case 'mp4': return '📹'
      case 'mov': return '🎥'
      default: return '📁'
    }
  }

  const handleDownload = async () => {
    if (!result?.downloadUrl) return

    try {
      const response = await fetch(result.downloadUrl)
      
      if (!response.ok) {
        // If file doesn't exist, show demo message
        const errorData = await response.json()
        if (errorData.demo) {
          alert('Demo Mode: In a real implementation, the converted video would be downloaded here.')
          return
        }
        throw new Error('Download failed')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = result.downloadUrl.split('/').pop() || 'converted-video'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      setError('Failed to download video. Please try again.')
    }
  }

  const saveSupabaseConfig = () => {
    if (supabaseUrl && supabaseAnonKey) {
      setIsSupabaseConfigured(true)
      setShowSupabaseConfig(false)
      // Store in localStorage for persistence
      localStorage.setItem('videoSupabaseUrl', supabaseUrl)
      localStorage.setItem('videoSupabaseAnonKey', supabaseAnonKey)
    } else {
      setError('Please provide both Supabase URL and Anon Key')
    }
  }

  const uploadToSupabase = async () => {
    if (!result?.downloadUrl) return
    
    setError(null)
    setUploading(true)
    
    if (!isSupabaseConfigured) {
      setError('Please configure Supabase settings first')
      setShowSupabaseConfig(true)
      setUploading(false)
      return
    }
    
    try {
      const timestamp = Date.now()
      const fileName = `converted-video-${timestamp}.${result.convertedFile.format}`
      
      const response = await fetch('/api/upload-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: result.downloadUrl, // Using same endpoint, but for video
          fileName,
          bucket: supabaseBucket,
          supabaseUrl,
          supabaseAnonKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload to Supabase')
      }

      const { path } = await response.json()
      
      // Update result with Supabase path
      setResult(prev => prev ? {
        ...prev,
        supabasePath: path
      } : null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload to Supabase')
    } finally {
      setUploading(false)
    }
  }

  // Load configs from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('videoSupabaseUrl')
    const savedKey = localStorage.getItem('videoSupabaseAnonKey')
    if (savedUrl && savedKey) {
      setSupabaseUrl(savedUrl)
      setSupabaseAnonKey(savedKey)
      setIsSupabaseConfigured(true)
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-6 w-6" />
          Video Converter
        </CardTitle>
        <CardDescription>
          Convert MP4 and MOV videos to WebM, GIF, or other formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {selectedFile ? (
            <div className="space-y-2">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
              <Badge variant="outline">Ready to convert</Badge>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your video here' : 'Choose or drag a video file'}
              </p>
              <p className="text-sm text-gray-500">
                Supports MP4 and MOV files up to 100MB
              </p>
            </div>
          )}
        </div>

        {/* Conversion Settings */}
        {selectedFile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webm">
                    <span className="flex items-center gap-2">
                      {getFormatIcon('webm')} WebM (Web optimized)
                    </span>
                  </SelectItem>
                  <SelectItem value="gif">
                    <span className="flex items-center gap-2">
                      {getFormatIcon('gif')} GIF (Animated)
                    </span>
                  </SelectItem>
                  <SelectItem value="mp4">
                    <span className="flex items-center gap-2">
                      {getFormatIcon('mp4')} MP4 (Universal)
                    </span>
                  </SelectItem>
                  <SelectItem value="mov">
                    <span className="flex items-center gap-2">
                      {getFormatIcon('mov')} MOV (QuickTime)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (480p, faster)</SelectItem>
                  <SelectItem value="medium">Medium (720p, balanced)</SelectItem>
                  <SelectItem value="high">High (1080p, best quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Supabase Configuration */}
        {selectedFile && (
          <div className="space-y-4 mt-6">
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="video-bucket">Supabase Bucket</Label>
              <Input
                id="video-bucket"
                type="text"
                value={supabaseBucket}
                onChange={(e) => setSupabaseBucket(e.target.value)}
                placeholder="videos"
              />
            </div>

            <div className="space-y-2">
              <Label>Supabase Configuration</Label>
              <Button
                variant={isSupabaseConfigured ? "outline" : "default"}
                className="w-full"
                onClick={() => setShowSupabaseConfig(true)}
              >
                <Database className="h-4 w-4 mr-2" />
                {isSupabaseConfigured ? 'Update Supabase Settings' : 'Configure Supabase'}
              </Button>
              {isSupabaseConfigured && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Connected to Supabase
                </p>
              )}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {selectedFile && (
          <Button 
            onClick={handleConvert} 
            disabled={isConverting}
            className="w-full"
            size="lg"
          >
            <Settings className={`h-4 w-4 mr-2 ${isConverting ? 'animate-spin' : ''}`} />
            {isConverting ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
          </Button>
        )}

        {/* Progress */}
        {isConverting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Converting video...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {result.message}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Original File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(result.originalFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{result.originalFile.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{result.originalFile.duration}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Converted File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(result.convertedFile.estimatedSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{result.convertedFile.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span>{result.convertedFile.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing:</span>
                    <span>{result.convertedFile.processingTime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDownload}
                disabled={!result?.downloadUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Converted Video
              </Button>

              {result?.supabasePath ? (
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Uploaded to Supabase: {result.supabasePath}
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={uploadToSupabase}
                  disabled={uploading || !result?.downloadUrl || !isSupabaseConfigured}
                >
                  {uploading ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Upload to Supabase
                    </>
                  )}
                </Button>
              )}

              {!isSupabaseConfigured && (
                <p className="text-xs text-muted-foreground text-center">
                  Configure Supabase settings to enable cloud upload
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Supabase Configuration Dialog */}
      <Dialog open={showSupabaseConfig} onOpenChange={setShowSupabaseConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Supabase for Videos</DialogTitle>
            <DialogDescription>
              Enter your Supabase project details to enable cloud storage uploads for videos.
              You can find these in your Supabase project settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Project URL</Label>
              <Input
                id="supabase-url"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Found in Settings → API → Project URL
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supabase-anon-key">Anon/Public Key</Label>
              <div className="relative">
                <Input
                  id="supabase-anon-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Found in Settings → API → Project API keys → anon public
              </p>
            </div>

            <Alert>
              <AlertDescription>
                Make sure you&apos;ve created a storage bucket named &ldquo;{supabaseBucket}&rdquo; in your Supabase project.
                You can change the bucket name in the settings above.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSupabaseConfig(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveSupabaseConfig}>
              <Database className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}