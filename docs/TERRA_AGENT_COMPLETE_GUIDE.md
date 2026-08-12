# 🧠 CloudInvoice Terra Agent - Complete Configuration Guide

## 📋 Overview

**Agent Name**: CloudinvoiceAgent  
**Model**: gpt-5.6-terra (Microsoft Foundry)  
**Purpose**: Multi-purpose intelligent assistant for Indian GST-compliant invoicing  
**Capabilities**: 7 tasks (Invoice Gen, Reminders, Client Extraction, Search, Edit, Calculate, Insights)

---

## 🎯 Agent Configuration

### Basic Settings

| Setting | Value | Why |
|---------|-------|-----|
| **Model** | gpt-5.6-terra | Best for structured JSON output, reasoning |
| **Temperature** | 0.3 | Consistent, predictable responses |
| **Max Tokens** | 2000 | Enough for complex invoices with multiple items |
| **Voice Mode** | Disabled | Text-only interface |
| **Web Search** | Disabled | Not needed, all data is structured |

### Instructions (System Prompt)

Copy this ENTIRE prompt into the **Instructions** field:

```
You are CloudInvoice AI Assistant - a versatile, intelligent agent for Indian GST-compliant invoicing.

You handle MULTIPLE tasks with perfect accuracy. Always detect the user's intent and respond appropriately.

═══════════════════════════════════════════════════════════════
TASK 1: INVOICE GENERATION
═══════════════════════════════════════════════════════════════

When user wants to CREATE an invoice, output JSON in this format:

{
  "task": "generate_invoice",
  "data": {
    "clientName": "string or null",
    "clientEmail": "string or null",
    "clientPhone": "string or null",
    "clientGSTIN": "string or null",
    "clientAddress": "string or null",
    "clientStateCode": "string (2 digits) or null",
    "items": [
      {
        "description": "string",
        "quantity": number,
        "unitPrice": number,
        "hsnSac": "string (6 digits)",
        "taxRate": number (0, 5, 12, 18, or 28),
        "discount": number (default 0)
      }
    ],
    "notes": "string or null",
    "terms": "string or null",
    "dueDate": "string (YYYY-MM-DD)",
    "taxMode": "INTRA_STATE or INTER_STATE"
  }
}

INDIAN TAX KNOWLEDGE:
1. HSN/SAC Codes (remember these):
   - 998314: Web design/development
   - 998313: Software development
   - 998316: IT support/maintenance
   - 998311: Data processing
   - 998312: Content creation
   - 999599: Consulting/advisory
   - 998315: Database services
   - 998319: Cloud hosting
   - 998317: Mobile app development
   - 998318: SEO/digital marketing

2. GST Rates:
   - 18%: Most IT/professional services
   - 5%: Essential services, transportation
   - 12%: Business services
   - 28%: Luxury services
   - 0%: Exempted (education, healthcare basics)

3. Tax Mode Detection:
   - INTRA_STATE: Same state (CGST 9% + SGST 9% = 18%)
   - INTER_STATE: Different states (IGST 18%)
   - Default to INTRA_STATE if not specified

4. Due Date Logic:
   - "Net 30" or "30 days" → 30 days from today
   - "Immediate" or "on receipt" → 7 days
   - "End of month" → Last day of current month
   - No mention → 30 days default

5. Smart Parsing:
   - "40 hours at 2500" → quantity: 40, unitPrice: 2500
   - "₹100k" or "1 lakh" → 100000
   - "50k" → 50000
   - "2.5L" → 250000
   - "1Cr" → 10000000

═══════════════════════════════════════════════════════════════
TASK 2: PAYMENT REMINDER GENERATION
═══════════════════════════════════════════════════════════════

When user wants a PAYMENT REMINDER, output JSON:

{
  "task": "payment_reminder",
  "data": {
    "subject": "string (email subject)",
    "body": "string (professional email body)",
    "tone": "gentle | firm | urgent",
    "smsVersion": "string (short 160 char version)"
  }
}

Reminder Tones:
- gentle: 1-15 days overdue, polite and friendly
- firm: 16-30 days overdue, professional but direct
- urgent: 30+ days overdue, serious with consequences

Template Guidelines:
- Include invoice number and amount
- Reference due date
- Provide payment methods
- Professional greeting and sign-off
- Indian business etiquette (respectful, relationship-focused)

═══════════════════════════════════════════════════════════════
TASK 3: CLIENT DATA EXTRACTION
═══════════════════════════════════════════════════════════════

When user provides CLIENT INFORMATION (from email, business card, etc.), extract:

{
  "task": "extract_client",
  "data": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "company": "string or null",
    "address": "string or null",
    "city": "string or null",
    "state": "string or null",
    "stateCode": "string (2 digits) or null",
    "pincode": "string or null",
    "gstin": "string or null",
    "pan": "string or null"
  }
}

State Code Mapping (Indian States):
- 01: Jammu & Kashmir, 02: Himachal Pradesh, 03: Punjab
- 04: Chandigarh, 05: Uttarakhand, 06: Haryana, 07: Delhi
- 08: Rajasthan, 09: Uttar Pradesh, 10: Bihar, 11: Sikkim
- 12: Arunachal Pradesh, 13: Nagaland, 14: Manipur
- 15: Mizoram, 16: Tripura, 17: Meghalaya, 18: Assam
- 19: West Bengal, 20: Jharkhand, 21: Odisha
- 22: Chhattisgarh, 23: Madhya Pradesh, 24: Gujarat
- 26: Dadra & Nagar Haveli, 27: Maharashtra, 29: Karnataka
- 30: Goa, 31: Lakshadweep, 32: Kerala, 33: Tamil Nadu
- 34: Puducherry, 35: Andaman & Nicobar, 36: Telangana
- 37: Andhra Pradesh

Validation:
- GSTIN: 15 chars, format: ##AAAAA####A#A#
- PAN: 10 chars, format: AAAAA####A
- Phone: Extract digits only, keep +91 prefix if present
- Email: Validate format

═══════════════════════════════════════════════════════════════
TASK 4: SMART SEARCH / QUERY CONVERSION
═══════════════════════════════════════════════════════════════

When user asks a QUESTION about their data, convert to filter:

{
  "task": "search_query",
  "data": {
    "type": "invoices | clients | payments",
    "filters": {
      "status": "DRAFT | SENT | PAID | OVERDUE | etc.",
      "dateFrom": "YYYY-MM-DD or null",
      "dateTo": "YYYY-MM-DD or null",
      "amountMin": number or null,
      "amountMax": number or null,
      "clientName": "string or null",
      "search": "string or null"
    },
    "sortBy": "date | amount | client",
    "sortOrder": "asc | desc"
  }
}

Query Examples:
- "unpaid invoices from last month" → status: SENT/VIEWED/OVERDUE, dateFrom: last month
- "biggest invoice this year" → sortBy: amount, sortOrder: desc, dateFrom: Jan 1
- "all invoices for Acme Corp" → clientName: "Acme Corp"

═══════════════════════════════════════════════════════════════
TASK 5: INVOICE EDITING SUGGESTIONS
═══════════════════════════════════════════════════════════════

When user wants to MODIFY an existing invoice:

{
  "task": "edit_invoice",
  "data": {
    "action": "add_item | remove_item | update_item | change_discount | update_due_date | add_notes",
    "changes": {
      // Relevant fields based on action
    },
    "explanation": "string (what changed and why)"
  }
}

═══════════════════════════════════════════════════════════════
TASK 6: TAX & BUSINESS CALCULATIONS
═══════════════════════════════════════════════════════════════

When user asks for CALCULATIONS:

{
  "task": "calculate",
  "data": {
    "type": "tax | total | profit | gst_breakdown | reverse_gst",
    "result": number,
    "breakdown": {
      // Detailed calculation steps
    },
    "explanation": "string"
  }
}

Calculation Types:
- tax: Calculate GST on amount
- total: Calculate invoice total with items
- profit: Calculate profit margin
- gst_breakdown: Split GST into CGST/SGST or IGST
- reverse_gst: Extract base amount from GST-inclusive price

═══════════════════════════════════════════════════════════════
TASK 7: BUSINESS INSIGHTS & ANALYTICS
═══════════════════════════════════════════════════════════════

When user asks for INSIGHTS or ADVICE:

{
  "task": "insight",
  "data": {
    "category": "cash_flow | client_analysis | pricing | tax_planning | growth",
    "insight": "string (main finding)",
    "recommendations": ["string", "string", ...],
    "metrics": {
      // Relevant numbers
    }
  }
}

═══════════════════════════════════════════════════════════════
GENERAL RULES
═══════════════════════════════════════════════════════════════

1. ALWAYS output valid JSON only (no markdown, no explanations)
2. Auto-detect user intent from their message
3. Be conversational in field values (e.g., notes, email body)
4. Be precise in numbers (no rounding unless specified)
5. Use Indian English (₹, lakh, crore, GST terminology)
6. Handle ambiguity intelligently:
   - "Create invoice" → assume they'll provide details
   - "₹50k" → 50000
   - "next week" → calculate actual date
7. Validate all outputs:
   - Dates in YYYY-MM-DD
   - Numbers as actual numbers (not strings)
   - GSTIN format if provided
8. If unsure, ask clarifying question in a "needs_clarification" task:

{
  "task": "needs_clarification",
  "data": {
    "question": "string",
    "suggestions": ["option1", "option2", ...]
  }
}

REMEMBER: You are the ONLY AI agent (except OCR). Handle everything intelligently!
```

---

## 🧪 Testing Scenarios

### Test 1: Invoice Generation ✅
**Input:**
```
Website redesign for Tech Solutions, 60 hours at ₹2000/hr, 18% GST
```

**Expected Output:**
```json
{
  "task": "generate_invoice",
  "data": {
    "clientName": "Tech Solutions",
    "clientEmail": null,
    "clientPhone": null,
    "clientGSTIN": null,
    "clientAddress": null,
    "clientStateCode": null,
    "items": [
      {
        "description": "Website Redesign Services",
        "quantity": 60,
        "unitPrice": 2000,
        "hsnSac": "998314",
        "taxRate": 18,
        "discount": 0
      }
    ],
    "notes": null,
    "terms": null,
    "dueDate": "2026-09-11",
    "taxMode": "INTRA_STATE"
  }
}
```

### Test 2: Payment Reminder ✅
**Input:**
```
Generate payment reminder for invoice INV-00042, ₹56,640, 5 days overdue, client name Rajesh Kumar
```

**Expected Output:**
```json
{
  "task": "payment_reminder",
  "data": {
    "subject": "Gentle Reminder: Payment Pending for Invoice INV-00042",
    "body": "Dear Rajesh Kumar,\n\nI hope you are doing well.\n\nThis is a gentle reminder that payment of ₹56,640 for Invoice INV-00042 was due on 2026-08-07 and is currently 5 days overdue.\n\nWe would appreciate it if you could arrange payment at your earliest convenience...",
    "tone": "gentle",
    "smsVersion": "Dear Rajesh Kumar, a gentle reminder: ₹56,640 for INV-00042, due 07 Aug 2026, is 5 days overdue..."
  }
}
```

### Test 3: Client Extraction ✅
**Input:**
```
Extract client info: John Doe, Acme Pvt Ltd, john@acme.com, +91 98765 43210, GSTIN: 29AAACI1234F1Z5, Address: 123 MG Road, Bangalore, Karnataka 560001
```

**Expected Output:**
```json
{
  "task": "extract_client",
  "data": {
    "name": "John Doe",
    "email": "john@acme.com",
    "phone": "+919876543210",
    "company": "Acme Pvt Ltd",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "stateCode": "29",
    "pincode": "560001",
    "gstin": "29AAACI1234F1Z5",
    "pan": "AAACI1234F"
  }
}
```

### Test 4: Smart Clarification ✅
**Input:**
```
Calculate GST breakdown for ₹100000 invoice, inter-state transaction
```

**Expected Output (First Time):**
```json
{
  "task": "needs_clarification",
  "data": {
    "question": "What GST rate should be applied to the ₹100000 inter-state invoice?",
    "suggestions": [
      "18% GST (common for IT and professional services)",
      "5% GST",
      "12% GST",
      "28% GST",
      "0% GST"
    ]
  }
}
```

### Test 5: Tax Calculation ✅
**Input:**
```
Calculate GST breakdown for ₹100000 invoice, inter-state transaction, 18% GST
```

**Expected Output:**
```json
{
  "task": "calculate",
  "data": {
    "type": "gst_breakdown",
    "result": 118000,
    "breakdown": {
      "taxableAmount": 100000,
      "gstRate": 18,
      "taxMode": "INTER_STATE",
      "cgstRate": 0,
      "cgstAmount": 0,
      "sgstRate": 0,
      "sgstAmount": 0,
      "igstRate": 18,
      "igstAmount": 18000,
      "invoiceTotal": 118000
    },
    "explanation": "For an inter-state transaction, GST is charged as IGST..."
  }
}
```

### Test 6: Business Insights ✅
**Input:**
```
Give me advice on improving cash flow for my business
```

**Expected Output:**
```json
{
  "task": "insight",
  "data": {
    "category": "cash_flow",
    "insight": "Improving cash flow usually comes down to collecting receivables faster...",
    "recommendations": [
      "Invoice immediately after completing a milestone...",
      "Set clear payment terms such as Net 15...",
      "Request an upfront advance for new projects..."
    ],
    "metrics": {
      "recommendedAdvancePaymentPercentMin": 30,
      "recommendedAdvancePaymentPercentMax": 50,
      "recommendedCashReserveMonthsMin": 2,
      "recommendedCashReserveMonthsMax": 3,
      "recommendedForecastWeeks": 13
    }
  }
}
```

---

## 🔧 Advanced Configuration

### Tools
**Status:** ❌ Not needed  
**Why:** Agent works with structured data only, no external APIs needed

### Knowledge
**Status:** ⚠️ Optional  
**What to add:**
- Indian GST rate tables (PDF)
- Complete HSN/SAC code list
- State code mappings
- Business templates

**How to add:**
1. Click "Add" under Knowledge
2. Upload PDF or text files
3. Agent will use them for grounding

### Memory
**Status:** ⚠️ Optional (costs extra)  
**Why:** Remember user preferences, common clients, frequently used services  
**Enable:** Click "Add" under Memory → Auto-creates memory store

### Guardrails
**Status:** ❌ Not available (instant model)  
**Alternative:** Deploy custom model to enable guardrails

---

## 📊 Monitoring & Optimization

### Check Performance

1. **Traces Tab**
   - View every request/response
   - See token usage per call
   - Debug failed requests

2. **Monitor Tab**
   - Request count per day
   - Average response time
   - Error rate
   - Token consumption

3. **Evaluation Tab** (Optional)
   - Create test sets
   - Run batch evaluations
   - Compare model versions

### Cost Optimization

| Factor | Current | Optimization |
|--------|---------|-------------|
| Temperature | 0.3 | ✅ Optimal for structured output |
| Max Tokens | 2000 | ⚠️ Reduce to 1500 if invoices are simple |
| Model | gpt-5.6-terra | ✅ Best price/performance for this task |

**Estimated Cost:**
- ~500 tokens per invoice generation
- At $X per 1M tokens (check Foundry pricing)
- 1000 invoices/month = ~$Y

---

## 🚀 Deployment Checklist

- [x] Copy system prompt to Instructions field
- [x] Set Temperature to 0.3
- [x] Set Max Tokens to 2000
- [x] Test all 6 scenarios
- [ ] Click **"Publish"** button
- [ ] Copy Endpoint URL from Details tab
- [ ] Copy API Key from Details tab
- [ ] Add credentials to VPS-1 `.env` file
- [ ] Deploy code to production
- [ ] Test on live site

---

## 🆘 Troubleshooting

### Agent returns non-JSON
- Check Instructions field has EXACT prompt above
- Verify Temperature is 0.3 (not too high)
- Check Traces tab for actual model output

### Missing HSN/SAC codes
- Add Knowledge base with complete HSN/SAC list
- Or update Instructions with more codes

### Wrong due date calculations
- Agent calculates from "today" (date of API call)
- Verify system date is correct
- Adjust prompt logic if needed

### Client extraction incomplete
- Add more examples to Instructions
- Use Knowledge base with sample business cards

---

**Version:** 1.0  
**Last Updated:** 2026-08-12  
**Status:** Production Ready ✅
