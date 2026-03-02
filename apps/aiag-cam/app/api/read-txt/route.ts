import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'knowledge_base.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(content, { status: 200 });
  } catch (error: any) {
    console.error("Error reading file:", error);
    return new NextResponse('Error reading file: ' + error.message, { status: 500 });
  }
}
