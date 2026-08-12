import { NextRequest, NextResponse } from "next/server";
import {
  generateInvoiceWithAI,
  aiInvoiceToFormData,
} from "@/lib/ai/invoice-agent";

/**
 * POST /api/ai/generate-invoice
 * Generate invoice data from natural language prompt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Validate input
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Prompt is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Call Microsoft Foundry AI
    const aiData = await generateInvoiceWithAI(prompt);

    // Convert to form-compatible format
    const formData = aiInvoiceToFormData(aiData);

    return NextResponse.json({
      success: true,
      data: formData,
      raw: aiData, // Include raw response for debugging
    });
  } catch (error) {
    console.error("AI invoice generation error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("not configured")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "AI features are not configured. Please contact the administrator.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
