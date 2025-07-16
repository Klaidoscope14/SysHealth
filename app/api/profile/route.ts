import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PROFILE = {
  name: "Admin User",
  email: "admin@example.com"
};

export async function GET() {
  
  return NextResponse.json({ 
    success: true, 
    profile: DEFAULT_PROFILE 
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.email) {
      return NextResponse.json({ 
        success: false, 
        error: "Name and email are required" 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      profile: {
        name: data.name,
        email: data.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update profile" 
    }, { status: 500 });
  }
}