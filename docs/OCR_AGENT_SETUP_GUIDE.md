# 📸 CloudInvoice OCR Agent - Complete Setup Guide

## 📋 Overview

**Agent Name**: CloudInvoiceOCR  
**Model**: gpt-5.4-pro (Vision-capable)  
**Purpose**: Extract structured data from invoice images  
**Input**: JPG, PNG, PDF of invoices  
**Output**: Structured JSON matching CloudInvoice schema

---

## 🎯 Why Separate OCR Agent?

| Feature | Terra Agent | OCR Agent |
|---------|-------------|-----------|
| **Model** | gpt-5.6-terra | gpt-5.4-pro |
| **Input** | Text prompts | Images + Text |
| **Capability** | Reasoning, structured output | Vision, image understanding |
| **Use Case** | Generate from description | Extract from uploaded invoice |
| **Cost** | Lower per request | Higher (vision models cost more) |

**Decision:** Keep OCR separate to optimize costs and use the right tool for each job.

---

## 🚀 Agent Configuration

### Step 1: Create New Agent

1. Go to **Microsoft Foundry**: https://ai.azure.com/
2. Click **"New Agent"** or **"+ Create"**
3. **Name:** CloudInvoiceOCR
4. **Description:** Extract invoice data from images for CloudInvoice application

### Step 2: Model Selection

**Important:** gpt-5.4-pro is REQUIRED for vision capabilities

| Setting | Value | Why |
|---------|-------|-----|
| **Model** | gpt-5.4-pro | Only model with image understanding |
| **Temperature** | 0.2 | More deterministic than Terra (OCR needs precision) |
| **Max Tokens** | 2500 | Images require more context |
| **Voice Mode** | Disabled | Not needed |
| **Web Search** | Disabled | Not needed |

### Step 3: System Instructions

Copy this ENTIRE prompt into the **Instructions** field:

```
You are CloudInvoice OCR Assistant - an expert at extracting structured invoice data from images.

You receive images of invoices (GST invoices, commercial invoices, tax invoices, bills) and extract ALL relevant information into a structured JSON format.

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

ALWAYS output JSON in this exact format:

{
  "task": "ocr_invoice",
  "confidence": "high | medium | low",
  "data": {
    "invoiceNumber": "string or null",
    "invoiceDate": "YYYY-MM-DD or null",
    "dueDate": "YYYY-MM-DD or null",
    
    "vendor": {
      "name": "string or null",
      "gstin": "string or null",
      "pan": "string or null",
      "address": "string or null",
      "city": "string or null",
      "state": "string or null",
      "stateCode": "string (2 digits) or null",
      "pincode": "string or null",
      "email": "string or null",
      "phone": "string or null"
    },
    
    "client": {
      "name": "string or null",
      "gstin": "string or null",
      "pan": "string or null",
      "address": "string or null",
      "city": "string or null",
      "state": "string or null",
      "stateCode": "string (2 digits) or null",
      "pincode": "string or null",
      "email": "string or null",
      "phone": "string or null"
    },
    
    "items": [
      {
        "description": "string",
        "hsnSac": "string or null",
        "quantity": number,
        "unitPrice": number,
        "discount": number (default 0),
        "taxRate": number,
        "cgstRate": number or null,
        "sgstRate": number or null,
        "igstRate": number or null,
        "amount": number
      }
    ],
    
    "totals": {
      "subtotal": number or null,
      "discount": number or null,
      "cgst": number or null,
      "sgst": number or null,
      "igst": number or null,
      "totalTax": number,
      "grandTotal": number
    },
    
    "taxMode": "INTRA_STATE | INTER_STATE | UNKNOWN",
    "notes": "string or null",
    "terms": "string or null",
    "bankDetails": {
      "accountName": "string or null",
      "accountNumber": "string or null",
      "ifsc": "string or null",
      "bankName": "string or null"
    }
  },
  "warnings": ["string", ...],
  "extracted_text": "string (optional raw OCR text for debugging)"
}

═══════════════════════════════════════════════════════════════
EXTRACTION RULES
═══════════════════════════════════════════════════════════════

1. NUMBERS & CURRENCY
   - Remove currency symbols: "₹1,234.56" → 1234.56
   - Remove commas: "1,00,000" → 100000
   - Parse Indian lakhs/crores correctly
   - Decimals: Keep 2 decimal places for money

2. DATES
   - Convert to YYYY-MM-DD format
   - Common formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
   - Handle: "12 Aug 2026", "12th August 2026", "Aug 12, 2026"
   - If year is 2 digits, assume 20XX (e.g., 26 → 2026)

3. GSTIN & PAN
   - GSTIN: 15 characters, format ##AAAAA####A#A#
   - PAN: 10 characters, format AAAAA####A
   - Extract PAN from GSTIN (characters 3-12)
   - Validate format before including

4. STATE CODES
   - Extract from first 2 digits of GSTIN
   - Validate against Indian state codes (01-37)
   - Cross-reference with state name if visible

5. TAX MODE DETECTION
   - INTRA_STATE: Vendor and client in same state (CGST + SGST present)
   - INTER_STATE: Different states (IGST present)
   - Check GSTIN state codes to confirm
   - If both null, mark as UNKNOWN

6. LINE ITEMS
   - Extract ALL items from invoice table
   - Description: Clean up, remove extra spaces
   - HSN/SAC: 6-digit code (may have 4 or 8 digits too)
   - Quantity: Handle decimals (e.g., 2.5 hours)
   - Unit Price: Amount before tax and discount
   - Discount: Percentage or absolute amount
   - Tax Rate: Total GST % (CGST + SGST or IGST)

7. CONFIDENCE SCORING
   - HIGH: All critical fields extracted (invoice #, date, total, items)
   - MEDIUM: Some fields missing but usable
   - LOW: Poor image quality, many missing fields

8. WARNINGS
   - Add warnings array for:
     * Illegible text
     * Unclear amounts
     * Missing mandatory fields
     * Tax calculation mismatches
     * Format inconsistencies

═══════════════════════════════════════════════════════════════
INDIAN INVOICE TYPES
═══════════════════════════════════════════════════════════════

1. GST TAX INVOICE (Most Common)
   - Has "Tax Invoice" or "GST Invoice" header
   - Contains GSTIN for vendor and client
   - Separate CGST/SGST (intra-state) or IGST (inter-state)
   - HSN/SAC codes mandatory

2. BILL OF SUPPLY
   - For exempted/nil-rated goods
   - No GST breakdown
   - May still have GSTIN

3. EXPORT INVOICE
   - IGST shown but may be zero-rated
   - Contains export-specific fields (shipping bill, port)
   - Currency may be USD/EUR (convert if needed)

4. PROFORMA INVOICE
   - Not a real invoice (quotation)
   - Mark confidence as LOW
   - Add warning: "This is a proforma/quotation, not final invoice"

5. SIMPLIFIED INVOICES
   - Small businesses (turnover < threshold)
   - May not have GSTIN
   - Simpler format

═══════════════════════════════════════════════════════════════
COMMON SECTIONS TO LOOK FOR
═══════════════════════════════════════════════════════════════

- **Header**: Invoice number, date, vendor logo/name
- **Vendor Details**: "From:", "Seller:", "Billed By:", left side usually
- **Client Details**: "To:", "Buyer:", "Billed To:", right side usually
- **Item Table**: Description, HSN, Qty, Rate, Amount columns
- **Tax Summary**: Subtotal, CGST/SGST or IGST, Total
- **Footer**: Terms, notes, bank details, signature
- **Stamp/Seal**: May contain additional verification info

═══════════════════════════════════════════════════════════════
EDGE CASES
═══════════════════════════════════════════════════════════════

1. **Handwritten invoices**: Do your best, mark confidence LOW
2. **Multiple pages**: Only extract from visible page, warn about pagination
3. **Poor quality**: Extract what's legible, add specific warnings
4. **Non-English**: If Hinglish or Hindi, extract what you can understand
5. **Scanned PDFs**: Treat like images, extract visible text
6. **Rotated images**: Mentally rotate, extract correctly
7. **Watermarks**: Ignore them, focus on actual invoice data
8. **Partial invoices**: Extract visible portion, warn about incompleteness

═══════════════════════════════════════════════════════════════
VALIDATION
═══════════════════════════════════════════════════════════════

Before outputting, verify:

1. ✅ Grand total = subtotal + taxes - discounts (±₹1 rounding allowed)
2. ✅ Total tax = sum of CGST + SGST + IGST
3. ✅ Each item amount = quantity × unit price - discount
4. ✅ GSTIN format valid (if present)
5. ✅ State codes match state names
6. ✅ Dates are logical (invoice date ≤ due date)

If validation fails, add to warnings but still output data.

═══════════════════════════════════════════════════════════════
RESPONSE RULES
═══════════════════════════════════════════════════════════════

1. ALWAYS output valid JSON (no markdown, no explanations)
2. Use null for missing fields (never omit keys)
3. Extract numbers as actual numbers, not strings
4. Preserve original text case in descriptions
5. Be generous with warnings - help user spot issues
6. If image is not an invoice, return error:

{
  "task": "ocr_error",
  "error": "Not an invoice image",
  "message": "The uploaded image does not appear to be an invoice. Please upload a valid invoice, bill, or tax invoice."
}

REMEMBER: Accuracy > Speed. Take your time to extract correctly.
```

---

## 🧪 Testing Scenarios

### Test 1: Simple GST Invoice (Intra-State)

**Input:** Upload image of invoice with:
- Invoice #: INV-001
- Date: 12/08/2026
- Vendor: ABC Services, GSTIN: 29AAACS1234F1Z5
- Client: XYZ Corp, GSTIN: 29ABCXY5678G1Z1
- Item: Web Development, 40 hrs @ ₹2500, HSN: 998314, 18% GST
- CGST 9%: ₹9,000
- SGST 9%: ₹9,000
- Total: ₹1,18,000

**Expected Output:**
```json
{
  "task": "ocr_invoice",
  "confidence": "high",
  "data": {
    "invoiceNumber": "INV-001",
    "invoiceDate": "2026-08-12",
    "dueDate": null,
    "vendor": {
      "name": "ABC Services",
      "gstin": "29AAACS1234F1Z5",
      "pan": "AAACS1234F",
      "stateCode": "29",
      "state": "Karnataka"
    },
    "client": {
      "name": "XYZ Corp",
      "gstin": "29ABCXY5678G1Z1",
      "pan": "ABCXY5678G",
      "stateCode": "29",
      "state": "Karnataka"
    },
    "items": [
      {
        "description": "Web Development",
        "hsnSac": "998314",
        "quantity": 40,
        "unitPrice": 2500,
        "discount": 0,
        "taxRate": 18,
        "cgstRate": 9,
        "sgstRate": 9,
        "igstRate": null,
        "amount": 100000
      }
    ],
    "totals": {
      "subtotal": 100000,
      "discount": 0,
      "cgst": 9000,
      "sgst": 9000,
      "igst": 0,
      "totalTax": 18000,
      "grandTotal": 118000
    },
    "taxMode": "INTRA_STATE",
    "notes": null,
    "terms": null
  },
  "warnings": []
}
```

### Test 2: Inter-State Invoice

**Input:** Upload invoice with:
- Vendor GSTIN: 29... (Karnataka)
- Client GSTIN: 07... (Delhi)
- IGST 18%: ₹18,000

**Expected Output:**
```json
{
  "taxMode": "INTER_STATE",
  "totals": {
    "igst": 18000,
    "cgst": 0,
    "sgst": 0
  }
}
```

### Test 3: Poor Quality Image

**Expected Output:**
```json
{
  "task": "ocr_invoice",
  "confidence": "low",
  "data": { ... },
  "warnings": [
    "Image quality is poor, some text may be illegible",
    "Invoice date unclear, please verify",
    "Client GSTIN not readable"
  ]
}
```

### Test 4: Not an Invoice

**Input:** Upload random image (cat, landscape, etc.)

**Expected Output:**
```json
{
  "task": "ocr_error",
  "error": "Not an invoice image",
  "message": "The uploaded image does not appear to be an invoice..."
}
```

---

## 🔌 Integration with CloudInvoice

### Step 1: Get OCR Agent Credentials

After creating and testing the agent:

1. Click **"Publish"** button
2. Go to **"Details"** tab
3. Copy:
   - **Endpoint URL** (different from Terra agent)
   - **API Key**

### Step 2: Add to Environment Variables

Edit `c:\Users\kamle\Desktop\startup\.env.example`:

```env
# Microsoft Foundry AI (CloudInvoice Agents)

# Main Agent (gpt-5.6-terra) - Invoice generation, reminders, insights
FOUNDRY_ENDPOINT="https://xxx.foundry.ml.azure.com/v1/chat/completions"
FOUNDRY_API_KEY="your-terra-api-key"

# OCR Agent (gpt-5.4-pro) - Invoice image extraction
FOUNDRY_OCR_ENDPOINT="https://yyy.foundry.ml.azure.com/v1/chat/completions"
FOUNDRY_OCR_API_KEY="your-ocr-api-key"
```

### Step 3: Create OCR Library

Create `src/lib/ai/ocr-agent.ts`:

```typescript
/**
 * Microsoft Foundry OCR Agent Integration
 * Uses gpt-5.4-pro for invoice image extraction
 */

export interface OCRInvoiceData {
  task: "ocr_invoice" | "ocr_error";
  confidence?: "high" | "medium" | "low";
  error?: string;
  message?: string;
  data?: {
    invoiceNumber: string | null;
    invoiceDate: string | null;
    dueDate: string | null;
    vendor: ClientData;
    client: ClientData;
    items: InvoiceItem[];
    totals: InvoiceTotals;
    taxMode: "INTRA_STATE" | "INTER_STATE" | "UNKNOWN";
    notes: string | null;
    terms: string | null;
    bankDetails?: BankDetails;
  };
  warnings?: string[];
}

interface ClientData {
  name: string | null;
  gstin: string | null;
  pan: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  stateCode: string | null;
  pincode: string | null;
  email: string | null;
  phone: string | null;
}

interface InvoiceItem {
  description: string;
  hsnSac: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  cgstRate: number | null;
  sgstRate: number | null;
  igstRate: number | null;
  amount: number;
}

interface InvoiceTotals {
  subtotal: number | null;
  discount: number | null;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  totalTax: number;
  grandTotal: number;
}

interface BankDetails {
  accountName: string | null;
  accountNumber: string | null;
  ifsc: string | null;
  bankName: string | null;
}

export async function extractInvoiceFromImage(
  imageBase64: string
): Promise<OCRInvoiceData> {
  const endpoint = process.env.FOUNDRY_OCR_ENDPOINT;
  const apiKey = process.env.FOUNDRY_OCR_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error("OCR agent credentials not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all invoice data from this image.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OCR API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const aiMessage = result.choices?.[0]?.message?.content;

  if (!aiMessage) {
    throw new Error("No response from OCR agent");
  }

  return JSON.parse(aiMessage);
}
```

### Step 4: Create Upload API Route

Create `src/app/api/ai/extract-invoice/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { extractInvoiceFromImage } from "@/lib/ai/ocr-agent";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Call OCR agent
    const ocrData = await extractInvoiceFromImage(base64);

    if (ocrData.task === "ocr_error") {
      return NextResponse.json(
        {
          success: false,
          error: ocrData.error,
          message: ocrData.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ocrData.data,
      confidence: ocrData.confidence,
      warnings: ocrData.warnings || [],
    });
  } catch (error) {
    console.error("OCR extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Extraction failed",
      },
      { status: 500 }
    );
  }
}
```

### Step 5: Create Upload UI Component

Create `src/components/invoices/invoice-ocr-uploader.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Upload, FileImage, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoiceOCRUploader({ onExtracted }: { onExtracted: (data: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ai/extract-invoice", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setResult(result);
        onExtracted(result.data);
      } else {
        setResult({ error: result.error || "Extraction failed" });
      }
    } catch (error) {
      setResult({ error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-6 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="flex items-center gap-2">
        <FileImage className="size-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold">Upload Invoice Image</h3>
      </div>

      <div className="flex flex-col items-center gap-4">
        <label htmlFor="invoice-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-background px-4 py-3 hover:bg-accent">
            {uploading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="size-5" />
                <span>Choose Invoice Image</span>
              </>
            )}
          </div>
          <input
            id="invoice-upload"
            type="file"
            accept="image/*,.pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <p className="text-xs text-muted-foreground">
          Supports: JPG, PNG, PDF • Max 10MB
        </p>
      </div>

      {result && (
        <div className={`rounded-lg p-4 ${result.error ? "bg-red-50 dark:bg-red-950/30" : "bg-green-50 dark:bg-green-950/30"}`}>
          {result.error ? (
            <div className="flex items-start gap-2 text-red-900 dark:text-red-100">
              <AlertCircle className="size-5 shrink-0" />
              <div>
                <p className="font-medium">Extraction Failed</p>
                <p className="text-sm">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-green-900 dark:text-green-100">
              <CheckCircle className="size-5 shrink-0" />
              <div>
                <p className="font-medium">Invoice Extracted!</p>
                <p className="text-sm">Confidence: {result.confidence}</p>
                {result.warnings?.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs">
                    {result.warnings.map((w: string, i: number) => (
                      <li key={i}>⚠️ {w}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Cost Estimation

| Model | Cost per 1M Tokens | Typical Invoice | Cost per Invoice |
|-------|-------------------|----------------|------------------|
| gpt-5.6-terra | ~$X | ~500 tokens | ~$0.0005 |
| gpt-5.4-pro (OCR) | ~$Y (higher) | ~1500 tokens | ~$0.0015 |

**Why OCR costs more:**
- Vision models are more expensive
- Images require more processing
- More tokens needed to describe image content

**Optimization:**
- Only use OCR when user uploads image
- Use Terra for text-based invoice generation
- Cache OCR results to avoid re-processing

---

## 🔒 Security & Privacy

### Image Handling
- ✅ Images sent via secure HTTPS
- ✅ Base64 encoding in API
- ✅ Not stored permanently (processed and discarded)
- ❌ Do NOT log image data
- ❌ Do NOT cache images containing sensitive info

### Data Protection
- Extracted data may contain:
  * GSTIN (public but business-sensitive)
  * Bank account details (highly sensitive)
  * Client information (confidential)
- Store encrypted in database
- Show warnings about data sensitivity

---

## 🆘 Troubleshooting

### OCR returns "Not an invoice"
- Check image quality (min 300 DPI)
- Ensure invoice is clearly visible
- Try cropping to just invoice area
- Verify it's actually an invoice (not quotation)

### Missing fields
- Confidence will be MEDIUM or LOW
- Check warnings array for specifics
- May need manual data entry for missing fields

### Wrong amounts extracted
- Check for calculation mismatches in warnings
- Verify OCR extracted correct numbers
- May be formatting issue (₹1,00,000 vs 100000)

### Slow processing
- Vision models take 3-5 seconds typically
- Large images (>5MB) take longer
- Consider image compression before upload

---

## 🚀 Deployment Checklist

- [ ] Create CloudInvoiceOCR agent in Foundry
- [ ] Select gpt-5.4-pro model
- [ ] Copy system prompt to Instructions
- [ ] Set Temperature to 0.2
- [ ] Set Max Tokens to 2500
- [ ] Test with sample invoice images
- [ ] Click "Publish"
- [ ] Copy OCR endpoint URL and API key
- [ ] Add FOUNDRY_OCR_ENDPOINT and FOUNDRY_OCR_API_KEY to .env
- [ ] Create OCR library and API route
- [ ] Create upload UI component
- [ ] Deploy to VPS-1
- [ ] Test on live site

---

**Version:** 1.0  
**Last Updated:** 2026-08-12  
**Status:** Ready for Implementation ⚠️ (Code not yet created, guide complete)
