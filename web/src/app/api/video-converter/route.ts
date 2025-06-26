import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const outputFormat = formData.get('format') as string;
    const quality = formData.get('quality') as string || 'medium';

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only MP4 and MOV files are supported.' 
      }, { status: 400 });
    }

    // Validate output format
    const allowedFormats = ['webm', 'gif', 'mp4', 'mov'];
    if (!allowedFormats.includes(outputFormat)) {
      return NextResponse.json({ 
        error: 'Invalid output format. Supported formats: webm, gif, mp4, mov' 
      }, { status: 400 });
    }

    // Process the video file
    const videoBuffer = await file.arrayBuffer();
    const videoSize = videoBuffer.byteLength;

    // Simulate processing time based on file size
    const processingTime = Math.min(Math.max(videoSize / 1000000, 1), 10);
    await new Promise(resolve => setTimeout(resolve, processingTime * 1000));

    // Store the original file for download (in a real app, this would be the converted file)
    const timestamp = Date.now();
    const filename = `video-${timestamp}.${outputFormat}`;
    
    // In a real implementation, you would:
    // 1. Use FFmpeg to convert the video
    // 2. Store the converted file in a temp directory or cloud storage
    // 3. Return the actual download URL
    
    // For demo, we'll store the original file with new extension
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const filePath = path.join(tempDir, filename);
      await fs.writeFile(filePath, Buffer.from(videoBuffer));
    } catch (storageError) {
      console.log('Storage demo - file not actually saved:', storageError);
    }

    // Quality settings for different formats
    const qualitySettings = {
      low: { bitrate: '500k', scale: '480:-1' },
      medium: { bitrate: '1M', scale: '720:-1' },
      high: { bitrate: '2M', scale: '1080:-1' }
    };

    const settings = qualitySettings[quality as keyof typeof qualitySettings] || qualitySettings.medium;

    // Simulate conversion result
    const result = {
      success: true,
      originalFile: {
        name: file.name,
        size: videoSize,
        type: file.type,
        duration: '00:00:30' // Simulated duration
      },
      convertedFile: {
        format: outputFormat,
        quality: quality,
        estimatedSize: Math.floor(videoSize * (outputFormat === 'gif' ? 0.8 : 0.6)),
        bitrate: settings.bitrate,
        resolution: settings.scale,
        processingTime: `${processingTime.toFixed(1)}s`
      },
      downloadUrl: `/api/download/${filename}`,
      message: `Video successfully converted to ${outputFormat.toUpperCase()}`
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Video conversion error:', error);
    return NextResponse.json({ 
      error: 'Failed to process video file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}