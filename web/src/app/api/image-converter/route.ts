import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images = formData.getAll('images') as File[]
    const format = formData.get('format') as string || 'webp'
    const quality = parseInt(formData.get('quality') as string || '85')
    const maxWidth = parseInt(formData.get('maxWidth') as string || '1920')

    const processedImages = []

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer())
      
      let sharpInstance = sharp(buffer)
      const metadata = await sharpInstance.metadata()
      
      // Resize if needed
      if (metadata.width && metadata.width > maxWidth) {
        sharpInstance = sharpInstance.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      }

      // Convert format and optimize
      let outputBuffer: Buffer
      const outputMetadata = { width: 0, height: 0 }

      switch (format) {
        case 'jpeg':
          outputBuffer = await sharpInstance
            .jpeg({ quality, progressive: true })
            .toBuffer()
          break
        case 'png':
          outputBuffer = await sharpInstance
            .png({ quality, compressionLevel: 9 })
            .toBuffer()
          break
        case 'gif':
          outputBuffer = await sharpInstance
            .gif()
            .toBuffer()
          break
        case 'webp':
        default:
          outputBuffer = await sharpInstance
            .webp({ quality })
            .toBuffer()
          break
      }

      // Get output metadata
      const outputSharp = sharp(outputBuffer)
      const outputMeta = await outputSharp.metadata()
      outputMetadata.width = outputMeta.width || 0
      outputMetadata.height = outputMeta.height || 0

      // Convert buffer to base64 for client-side display
      const base64 = outputBuffer.toString('base64')
      const url = `data:image/${format};base64,${base64}`

      processedImages.push({
        id: Math.random().toString(36).substr(2, 9),
        originalName: image.name,
        originalSize: image.size,
        processedSize: outputBuffer.length,
        format,
        width: outputMetadata.width,
        height: outputMetadata.height,
        url,
        base64
      })
    }

    return NextResponse.json(processedImages)
  } catch (error) {
    console.error('Image processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    )
  }
} 