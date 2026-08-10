import { NextRequest, NextResponse } from "next/server";
import ts from "typescript";

export async function POST(req: NextRequest) {
  const { code } = (await req.json()) as { code?: string };

  if (typeof code !== "string") {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }