import { NextRequest, NextResponse } from 'next/server';

// Default profile if none exists
const DEFAULT_PROFILE = {
  name: "Admin User",
  email: "admin@example.com"
};

// GET handler to retrieve the user profile
export async function GET() {
  // In a real app, this would get the profile from a database
  // For now, we'll just return a successful response
  
  return NextResponse.json({ 
    success: true, 
    profile: DEFAULT_PROFILE 
  });
}

// POST handler to update the user profile
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the request body
    if (!data.name || !data.email) {
      return NextResponse.json({ 
        success: false, 
        error: "Name and email are required" 
      }, { status: 400 });
    }
    
    // In a real app, this would update the profile in a database
    // For now, we'll just return a successful response with the updated profile
    
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