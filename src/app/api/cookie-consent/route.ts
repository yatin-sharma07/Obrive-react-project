import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { value } = await req.json();

    if (typeof value !== "string") {
      return NextResponse.json({ success: false, error: "Invalid value" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "cookie_consent",
      value,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }
}
