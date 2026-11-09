import { NextResponse } from "next/server";
import { syncKnowledgeBase, getKnowledgeBaseMarkdown } from "@/lib/ai/knowledge-sync";

export async function GET() {
  const result = await syncKnowledgeBase(true);
  const markdown = await getKnowledgeBaseMarkdown();

  return NextResponse.json({
    success: true,
    message: "Solidwin AI Knowledge Base synchronized from system data",
    timestamp: result.timestamp,
    sizeBytes: Buffer.byteLength(markdown, "utf-8"),
    lines: markdown.split("\n").length,
  });
}

export async function POST() {
  const result = await syncKnowledgeBase(true);
  return NextResponse.json({
    success: true,
    message: "Force sync completed",
    timestamp: result.timestamp,
  });
}
