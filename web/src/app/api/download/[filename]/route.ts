import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const params = await context.params;
    const filename = params.filename;
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // For security, only allow specific file extensions
    const allowedExtensions = ['.webm', '.gif', '.mp4', '.mov'];
    const hasValidExtension = allowedExtensions.some(ext => filename.endsWith(ext));
    
    if (!hasValidExtension) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // In a real implementation, you would store files in a temporary directory
    // For demo purposes, we'll create a placeholder response
    const tempDir = join(process.cwd(), 'temp');
    const filePath = join(tempDir, filename);

    try {
      // Try to read the actual file if it exists
      const fileBuffer = await readFile(filePath);
      
      // Determine content type based on file extension
      const contentTypes: { [key: string]: string } = {
        '.webm': 'video/webm',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime'
      };

      const extension = Object.keys(contentTypes).find(ext => filename.endsWith(ext)) || '.mp4';
      const contentType = contentTypes[extension];

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache',
        },
      });
    } catch {
      // If file doesn't exist, return a demo response
      return NextResponse.json({
        error: 'File not found',
        message: 'This is a demo - actual video conversion would store files for download',
        filename: filename,
        demo: true
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Failed to download file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}