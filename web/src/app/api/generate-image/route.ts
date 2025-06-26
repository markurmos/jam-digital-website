import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', style = 'vivid', apiKey } = await request.json()
    
    // Use provided API key or fall back to environment variable
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not provided' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client with the provided key
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      style: style as 'vivid' | 'natural',
      response_format: 'url'
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI')
    }

    const imageUrl = response.data[0].url
    
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }
    
    return NextResponse.json({
      url: imageUrl,
      revised_prompt: response.data[0].revised_prompt || prompt,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
} 