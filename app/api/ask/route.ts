import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ message: "API route is working!" });
  } catch (error) {
    return NextResponse.json({ error: "Test error" }, { status: 500 });
  }
}