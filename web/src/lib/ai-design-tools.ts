/**
 * AI Design Tools Integration Guide for Your Stack
 * 
 * This file contains examples and configurations for integrating
 * various AI design tools into your Next.js + Supabase stack
 */

// 1. DALL-E 3 Integration (OpenAI)
export const dalleConfig = {
  endpoint: 'https://api.openai.com/v1/images/generations',
  models: ['dall-e-3', 'dall-e-2'],
  features: [
    'Text to Image',
    'Image Variations',
    'Inpainting (DALL-E 2)',
    'High quality outputs'
  ],
  pricing: '$0.04-0.08 per image',
  example: `
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Modern e-commerce hero section with abstract shapes',
        size: '1792x1024',
        style: 'vivid'
      })
    })
  `
}

// 2. Stability AI Integration
export const stabilityConfig = {
  endpoint: 'https://api.stability.ai/v1/generation',
  models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
  features: [
    'Text to Image',
    'Image to Image',
    'Inpainting',
    'Upscaling',
    'Background Removal'
  ],
  pricing: '$0.002-0.02 per image',
  example: `
    const response = await fetch('/api/stability-generate', {
      method: 'POST',
      body: JSON.stringify({
        text_prompts: [{
          text: 'Product photography on gradient background',
          weight: 1
        }],
        cfg_scale: 7,
        samples: 1,
        steps: 30
      })
    })
  `
}

// 3. Replicate Integration (Multiple Models)
export const replicateConfig = {
  endpoint: 'https://api.replicate.com/v1/predictions',
  models: [
    'stability-ai/sdxl',
    'lucataco/remove-bg',
    'tencentarc/photomaker',
    'cjwbw/rembg'
  ],
  features: [
    'Multiple AI models',
    'Background removal',
    'Image upscaling',
    'Style transfer',
    'Face restoration'
  ],
  pricing: 'Pay per second of compute',
  example: `
    const response = await fetch('/api/replicate-predict', {
      method: 'POST',
      body: JSON.stringify({
        version: 'sdxl-model-id',
        input: {
          prompt: 'Professional headshot with studio lighting',
          negative_prompt: 'low quality, blurry'
        }
      })
    })
  `
}

// 4. Vercel v0 Integration (Coming Soon)
export const v0Config = {
  endpoint: 'https://v0.dev/api (Beta)',
  features: [
    'UI Component Generation',
    'Tailwind CSS Compatible',
    'shadcn/ui Components',
    'React/Next.js Export',
    'Responsive Designs'
  ],
  pricing: 'TBD',
  currentUsage: 'Web interface only, API coming soon',
  alternativeApproach: `
    // Use Claude API with structured prompts for component generation
    const componentPrompt = \`
      Generate a React component using Tailwind CSS and shadcn/ui:
      - Component: ProductCard
      - Props: title, price, image, description
      - Include hover effects and responsive design
      - Use shadcn/ui Card component
    \`
  `
}

// 5. Figma Plugin Integration
export const figmaIntegration = {
  plugins: [
    { name: 'Magician', features: ['AI copywriting', 'Icon generation'] },
    { name: 'Genius', features: ['UI generation from text'] },
    { name: 'AI Image Generator', features: ['Stock photo generation'] }
  ],
  apiEndpoint: 'https://api.figma.com/v1/',
  webhooks: true,
  features: [
    'Design to Code',
    'Asset Export',
    'Component Sync',
    'Real-time Updates'
  ],
  example: `
    // Listen for Figma updates
    app.post('/webhook/figma', async (req, res) => {
      const { file_key, event_type } = req.body
      if (event_type === 'FILE_UPDATE') {
        // Sync designs to your app
        await syncFigmaComponents(file_key)
      }
    })
  `
}

// 6. Complete AI Design Pipeline Example
export const aiDesignPipeline = {
  workflow: [
    {
      step: 1,
      name: 'Generate Base Design',
      tool: 'DALL-E 3 or Stability AI',
      purpose: 'Create hero images, backgrounds, product shots'
    },
    {
      step: 2,
      name: 'Process & Optimize',
      tool: 'Your Image Converter',
      purpose: 'Convert formats, resize, compress for web'
    },
    {
      step: 3,
      name: 'Remove Background',
      tool: 'Replicate (rembg)',
      purpose: 'Create transparent PNGs for products'
    },
    {
      step: 4,
      name: 'Generate UI Components',
      tool: 'Claude API or v0',
      purpose: 'Create React components that use the images'
    },
    {
      step: 5,
      name: 'Store Assets',
      tool: 'Supabase Storage',
      purpose: 'CDN-backed storage for all generated assets'
    }
  ]
}

// 7. Recommended Stack Addition
export const recommendedStack = `
  // Add to your package.json
  {
    "dependencies": {
      "openai": "^4.0.0",          // For DALL-E
      "replicate": "^0.25.0",      // For multiple AI models
      "@anthropic-ai/sdk": "^0.27.0", // Already have for Claude
      "sharp": "^0.33.0"           // Already have for image processing
    }
  }

  // Environment variables to add
  OPENAI_API_KEY=sk-...
  REPLICATE_API_TOKEN=r8_...
  STABILITY_API_KEY=sk-...
`

// 8. Cost Optimization Tips
export const costOptimization = {
  tips: [
    'Cache generated images in Supabase to avoid regenerating',
    'Use DALL-E 2 for drafts, DALL-E 3 for final versions',
    'Implement request throttling and user quotas',
    'Use Stability AI for bulk generation (cheaper)',
    'Compress images with your converter before storage'
  ],
  example: `
    // Check cache before generating
    const cached = await supabase
      .storage
      .from('ai-generated')
      .download(\`cache/\${promptHash}.webp\`)
    
    if (cached.data) {
      return cached.data
    }
    
    // Generate only if not cached
    const newImage = await generateImage(prompt)
    await cacheImage(newImage, promptHash)
  `
} 