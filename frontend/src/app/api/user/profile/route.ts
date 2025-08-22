import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user profile from your backend
    const res = await fetch(
      `${process.env.API_BASE_URL}/user/${session.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }
    const profile = await res.json();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Update user profile in your backend
    const res = await fetch(
      `${process.env.API_BASE_URL}/user/${session.user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const updatedProfile = await res.json();
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
