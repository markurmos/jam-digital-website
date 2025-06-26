'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, Loader2, Check, X, Edit2, Save, Database, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProcessedImage {
  id: string
  originalName: string
  customName?: string
  originalSize: number
  processedSize: number
  format: string
  width: number
  height: number
  url: string
  base64: string
  supabasePath?: string
}

export default function ImageConverterPage() {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [processing, setProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState('webp')
  const [quality, setQuality] = useState(85)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [supabaseBucket, setSupabaseBucket] = useState('images')
  const [error, setError] = useState<string | null>(null)
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [tempName, setTempName] = useState('')
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [showAiConfig, setShowAiConfig] = useState(false)
  const [openAiKey, setOpenAiKey] = useState('')
  const [isAiConfigured, setIsAiConfigured] = useState(false)
  const [aiImageSize, setAiImageSize] = useState('1024x1024')
  const [aiImageStyle, setAiImageStyle] = useState('vivid')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    setProcessing(true)
    
    try {
      const formData = new FormData()
      acceptedFiles.forEach(file => {
        formData.append('images', file)
      })
      formData.append('format', selectedFormat)
      formData.append('quality', quality.toString())
      formData.append('maxWidth', maxWidth.toString())

      const response = await fetch('/api/image-converter', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process images')
      }

      const processedImages = await response.json()
      setImages(prev => [...prev, ...processedImages])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process images')
    } finally {
      setProcessing(false)
    }
  }, [selectedFormat, quality, maxWidth])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  })

  const uploadToSupabase = async (image: ProcessedImage) => {
    setError(null)
    
    if (!isSupabaseConfigured) {
      setError('Please configure Supabase settings first')
      setShowSupabaseConfig(true)
      return
    }
    
    try {
      const baseName = image.customName || image.originalName.split('.')[0]
      const response = await fetch('/api/upload-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: image.url,
          fileName: `${baseName}.${image.format}`,
          bucket: supabaseBucket,
          supabaseUrl,
          supabaseAnonKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload to Supabase')
      }

      const { path } = await response.json()
      
      setImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, supabasePath: path }
            : img
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload to Supabase')
    }
  }

  const uploadAllToSupabase = async () => {
    setUploadProgress(0)
    const totalImages = images.filter(img => !img.supabasePath).length
    let uploaded = 0

    for (const image of images) {
      if (!image.supabasePath) {
        await uploadToSupabase(image)
        uploaded++
        setUploadProgress((uploaded / totalImages) * 100)
      }
    }
  }

  const downloadImage = (image: ProcessedImage) => {
    const a = document.createElement('a')
    a.href = image.url
    const baseName = image.customName || image.originalName.split('.')[0]
    a.download = `${baseName}.${image.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const updateImageName = (imageId: string, newName: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, customName: newName }
          : img
      )
    )
  }

  const clearImages = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.url)
    })
    setImages([])
    setUploadProgress(0)
  }

  const saveSupabaseConfig = () => {
    if (supabaseUrl && supabaseAnonKey) {
      setIsSupabaseConfigured(true)
      setShowSupabaseConfig(false)
      // Store in localStorage for persistence
      localStorage.setItem('supabaseUrl', supabaseUrl)
      localStorage.setItem('supabaseAnonKey', supabaseAnonKey)
    } else {
      setError('Please provide both Supabase URL and Anon Key')
    }
  }

  const saveAiConfig = () => {
    if (openAiKey) {
      setIsAiConfigured(true)
      setShowAiConfig(false)
      localStorage.setItem('openAiKey', openAiKey)
    } else {
      setError('Please provide OpenAI API Key')
    }
  }

  const generateAiImage = async () => {
    if (!isAiConfigured) {
      setError('Please configure OpenAI settings first')
      setShowAiConfig(true)
      return
    }

    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for image generation')
      return
    }

    setAiGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          size: aiImageSize,
          style: aiImageStyle,
          apiKey: openAiKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const { url } = await response.json()
      
      // Download the generated image and add it to our processing queue
      const imageResponse = await fetch(url)
      const blob = await imageResponse.blob()
      const file = new File([blob], `ai-generated-${Date.now()}.png`, { type: 'image/png' })
      
      // Process it through our existing pipeline
      await onDrop([file])
      
      // Clear the prompt
      setAiPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI image')
    } finally {
      setAiGenerating(false)
    }
  }

  // Load configs from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('supabaseUrl')
    const savedKey = localStorage.getItem('supabaseAnonKey')
    if (savedUrl && savedKey) {
      setSupabaseUrl(savedUrl)
      setSupabaseAnonKey(savedKey)
      setIsSupabaseConfigured(true)
    }

    const savedOpenAiKey = localStorage.getItem('openAiKey')
    if (savedOpenAiKey) {
      setOpenAiKey(savedOpenAiKey)
      setIsAiConfigured(true)
    }
  }, [])

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">Image Converter & Optimizer</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="generate">AI Generate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
                <CardDescription>
                  Drag and drop images or click to select files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors duration-200
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-primary">Drop the images here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop images here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PNG, JPG, JPEG, GIF, WebP
                      </p>
                    </div>
                  )}
                </div>

                {processing && (
                  <div className="mt-4 flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <span>Processing images...</span>
                  </div>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="generate">
              <CardHeader>
                <CardTitle>AI Image Generation</CardTitle>
                <CardDescription>
                  Generate images using DALL-E 3 AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-prompt">Describe your image</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder="A modern e-commerce hero image with abstract shapes and vibrant colors..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-size">Image Size</Label>
                    <Select value={aiImageSize} onValueChange={setAiImageSize}>
                      <SelectTrigger id="ai-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">Square (1024×1024)</SelectItem>
                        <SelectItem value="1792x1024">Landscape (1792×1024)</SelectItem>
                        <SelectItem value="1024x1792">Portrait (1024×1792)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-style">Style</Label>
                    <Select value={aiImageStyle} onValueChange={setAiImageStyle}>
                      <SelectTrigger id="ai-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivid">Vivid</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {!isAiConfigured && (
                  <Alert>
                    <AlertDescription>
                      Configure your OpenAI API key in settings to enable AI generation
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button
                  onClick={generateAiImage}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="w-full"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure conversion options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality">
                Quality: {quality}%
              </Label>
              <Input
                id="quality"
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="maxWidth">
                Max Width: {maxWidth}px
              </Label>
              <Input
                id="maxWidth"
                type="number"
                min="100"
                max="4000"
                step="100"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="bucket">Supabase Bucket</Label>
              <Input
                id="bucket"
                type="text"
                value={supabaseBucket}
                onChange={(e) => setSupabaseBucket(e.target.value)}
                placeholder="images"
              />
            </div>

            <Separator className="my-4" />

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
                  <Check className="h-3 w-3 text-green-600" />
                  Connected to Supabase
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label>AI Configuration</Label>
              <Button
                variant={isAiConfigured ? "outline" : "default"}
                className="w-full"
                onClick={() => setShowAiConfig(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isAiConfigured ? 'Update OpenAI Settings' : 'Configure OpenAI'}
              </Button>
              {isAiConfigured && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  AI Generation Enabled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Images</CardTitle>
            <CardDescription>
              {images.length} image{images.length > 1 ? 's' : ''} processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <Button
                onClick={uploadAllToSupabase}
                disabled={images.every(img => img.supabasePath)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload All to Supabase
              </Button>
              <Button variant="outline" onClick={clearImages}>
                Clear All
              </Button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <Progress value={uploadProgress} className="mb-4" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      {editingImageId === image.id ? (
                        <div className="flex gap-1 items-center">
                          <Input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateImageName(image.id, tempName)
                                setEditingImageId(null)
                              }
                            }}
                            className="h-7 text-sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              updateImageName(image.id, tempName)
                              setEditingImageId(null)
                            }}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => setEditingImageId(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium text-sm truncate flex-1">
                            {image.customName || image.originalName.split('.')[0]}.{image.format}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setEditingImageId(image.id)
                              setTempName(image.customName || image.originalName.split('.')[0])
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Original: {image.originalName}</p>
                      <p>Format: {image.format.toUpperCase()}</p>
                      <p>Size: {(image.processedSize / 1024).toFixed(1)} KB</p>
                      <p>Dimensions: {image.width} × {image.height}</p>
                      <p>
                        Savings: {((1 - image.processedSize / image.originalSize) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(image)}
                        title="Download image"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {image.supabasePath ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Uploaded
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => uploadToSupabase(image)}
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supabase Configuration Dialog */}
      <Dialog open={showSupabaseConfig} onOpenChange={setShowSupabaseConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Supabase</DialogTitle>
            <DialogDescription>
              Enter your Supabase project details to enable cloud storage uploads.
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

      {/* AI Configuration Dialog */}
      <Dialog open={showAiConfig} onOpenChange={setShowAiConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure OpenAI</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to enable AI image generation with DALL-E 3.
              You can find this in your OpenAI account settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Key</Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="sk-..."
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
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
                Get your API key from platform.openai.com
              </p>
            </div>

            <Alert>
              <AlertDescription>
                Your API key is stored locally and sent directly to OpenAI.
                Pricing: ~$0.04 per square image, ~$0.08 per HD image.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAiConfig(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveAiConfig}>
              <Sparkles className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 