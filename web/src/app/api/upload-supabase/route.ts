import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, fileName, bucket, supabaseUrl, supabaseAnonKey } = await request.json()
    
    // Use provided credentials or fall back to environment variables
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = supabaseAnonKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      return NextResponse.json(
        { error: 'Supabase credentials not provided' },
        { status: 400 }
      )
    }

    // Initialize Supabase client with provided credentials
    const supabase = createClient(url, key)
    
    // Fetch the image from the blob URL
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Generate unique file path
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const filePath = `${timestamp}-${randomString}-${fileName}`
    
    // Upload to Supabase
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: blob.type,
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      throw error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return NextResponse.json({
      path: filePath,
      publicUrl,
      bucket
    })
  } catch (error) {
    console.error('Supabase upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload to Supabase' },
      { status: 500 }
    )
  }
} 