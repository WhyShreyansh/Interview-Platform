import { NextRequest, NextResponse } from "next/server";
import ts from "typescript";

export async function POST(req: NextRequest) {
  const { code } = (await req.json()) as { code?: string };

  if (typeof code !== "string") {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  try {
    const result = ts.transpileModule(code, {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    });
    return NextResponse.json({ js: result.outputText });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to transpile TypeScript" },
      { status: 400 }
    );
  }
}