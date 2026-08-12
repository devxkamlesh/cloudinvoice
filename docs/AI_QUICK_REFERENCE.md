# 🚀 CloudInvoice AI - Quick Reference Card

## 📚 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `AI_INTEGRATION_DEPLOYMENT.md` | Deployment steps for Terra agent | Ready to deploy Terra |
| `TERRA_AGENT_COMPLETE_GUIDE.md` | Full Terra configuration & testing | Setting up main agent |
| `OCR_AGENT_SETUP_GUIDE.md` | Complete OCR setup & integration | Adding invoice upload |
| `AI_QUICK_REFERENCE.md` | This file - quick lookups | Need quick info |

---

## 🤖 Two Agents Overview

| Feature | **Terra Agent** (Main) | **OCR Agent** (Optional) |
|---------|----------------------|-------------------------|
| **Model** | gpt-5.6-terra | gpt-5.4-pro |
| **Input** | Text prompts | Images (JPG, PNG, PDF) |
| **Tasks** | 7 capabilities | 1 capability (OCR) |
| **Cost** | Lower | Higher (vision model) |
| **Status** | ✅ Integrated | ⚠️ Not yet built |
| **Env Vars** | `FOUNDRY_ENDPOINT`<br>`FOUNDRY_API_KEY` | `FOUNDRY_OCR_ENDPOINT`<br>`FOUNDRY_OCR_API_KEY` |

---

## 🎯 Terra Agent - 7 Capabilities

### 1. Invoice Generation
**Input:** `Website redesign for Tech Solutions, 60 hours at ₹2000/hr, 18% GST`  
**Output:** Full invoice JSON with client, items, HSN/SAC, tax breakdown

### 2. Payment Reminders
**Input:** `Generate payment reminder for invoice INV-00042, ₹56,640, 5 days overdue`  
**Output:** Professional email + SMS version (gentle/firm/urgent tone)

### 3. Client Extraction
**Input:** `Extract: John Doe, Acme Pvt Ltd, john@acme.com, +91 98765 43210, GSTIN: 29AAACI1234F1Z5`  
**Output:** Structured client data with PAN extracted from GSTIN

### 4. Smart Search
**Input:** `Show me unpaid invoices from last month above ₹50000`  
**Output:** Filter criteria for database query

### 5. Invoice Editing
**Input:** `Add 10% discount to invoice INV-123`  
**Output:** Edit instructions with explanation

### 6. Tax Calculations
**Input:** `Calculate GST breakdown for ₹100000 invoice, inter-state, 18% GST`  
**Output:** CGST/SGST/IGST breakdown with totals

### 7. Business Insights
**Input:** `Give me advice on improving cash flow`  
**Output:** Actionable recommendations with metrics

---

## 📸 OCR Agent - Invoice Upload

### Capability: Extract from Image
**Input:** Upload invoice image (JPG/PNG/PDF)  
**Output:** Structured JSON with:
- Invoice number, dates
- Vendor & client details (GSTIN, addresses)
- Line items (description, HSN/SAC, quantities, prices)
- Tax breakdown (CGST/SGST/IGST)
- Bank details
- Confidence score (high/medium/low)
- Warnings array

---

## 🔑 Environment Variables

### VPS-1 .env File Location
```
/home/ubuntu/cloudinvoice/.env
```

### Required Variables

```env
# Terra Agent (Main) - REQUIRED
FOUNDRY_ENDPOINT="https://xxx.foundry.ml.azure.com/v1/chat/completions"
FOUNDRY_API_KEY="your-terra-api-key-here"

# OCR Agent (Optional) - Only if implementing image upload
FOUNDRY_OCR_ENDPOINT="https://yyy.foundry.ml.azure.com/v1/chat/completions"
FOUNDRY_OCR_API_KEY="your-ocr-api-key-here"
```

### Where to Get Credentials

1. Go to: https://ai.azure.com/
2. Open agent: **CloudinvoiceAgent** (or **CloudInvoiceOCR**)
3. Click: **"Publish"** → **"Details"** tab
4. Copy: Endpoint URL + API Key

---

## 🚀 Deployment Commands

### SSH into VPS-1
```bash
ssh ubuntu@161.118.176.26
cd /home/ubuntu/cloudinvoice
```

### Add Credentials
```bash
nano .env
# Add FOUNDRY_ENDPOINT and FOUNDRY_API_KEY
# Save: Ctrl+X, Y, Enter
```

### Deploy Latest Code
```bash
git pull origin main
docker compose down
docker compose up -d --build
docker compose logs app -f
# Press Ctrl+C to exit logs
```

### Check Status
```bash
docker compose ps
curl http://localhost:3002/api/health
```

---

## 🧪 Testing URLs

### Local Development
```
http://localhost:3000/invoices/new
```

### Production (VPS-1)
```
https://cloudinvoice.co.in/invoices/new
```

### What to Look For
- Purple/blue AI box at top: "AI Invoice Generator"
- Text area for natural language input
- "Generate Invoice" button with sparkle icon
- Results display below after generation

---

## 🎨 UI Components

| Component | Path | Purpose |
|-----------|------|---------|
| AI Input | `src/components/invoices/ai-invoice-generator.tsx` | Text prompt interface |
| AI Display | `src/components/invoices/ai-invoice-generator-wrapper.tsx` | Show generated data |
| OCR Upload | `src/components/invoices/invoice-ocr-uploader.tsx` | Image upload (not created yet) |

---

## 📡 API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/ai/generate-invoice` | POST | Generate from text | ✅ Live |
| `/api/ai/extract-invoice` | POST | Extract from image | ⚠️ Not created |

---

## 🐛 Common Issues & Fixes

### Issue: "AI features are not configured"
**Fix:** Add `FOUNDRY_ENDPOINT` and `FOUNDRY_API_KEY` to VPS-1 `.env`, then restart

### Issue: Foundry API error (401)
**Fix:** Invalid API key. Regenerate in Foundry Details tab

### Issue: AI button not showing
**Fix:** Clear browser cache, check Docker logs: `docker compose logs app`

### Issue: Generation fails silently
**Fix:** Check Foundry → CloudinvoiceAgent → Traces tab for actual error

### Issue: Wrong HSN/SAC codes
**Fix:** Add Knowledge base in Foundry with complete HSN/SAC list

---

## 📊 Cost Monitoring

### Check Usage
1. Go to: https://ai.azure.com/
2. Open: CloudinvoiceAgent (or CloudInvoiceOCR)
3. Click: **"Monitor"** tab
4. View: Requests, tokens, errors, response time

### Typical Usage
- **Terra:** ~500 tokens per invoice = ~$0.0005 per generation
- **OCR:** ~1500 tokens per image = ~$0.0015 per extraction

### Optimization Tips
- Use Terra for text-based generation (cheaper)
- Only use OCR when user uploads image
- Consider caching common invoice patterns

---

## 🔒 Security Checklist

- [x] API keys in `.env` (not in code)
- [x] `.env` is gitignored
- [x] API requests server-side only
- [x] Prompt length limited (2000 chars)
- [ ] Add rate limiting (Upstash Redis - future)
- [ ] Encrypt extracted data in database (future)
- [ ] Add user consent for AI features (future)

---

## 🎓 Model Settings Summary

| Setting | Terra | OCR | Why Different |
|---------|-------|-----|---------------|
| **Temperature** | 0.3 | 0.2 | OCR needs more precision |
| **Max Tokens** | 2000 | 2500 | Images need more context |
| **Model** | gpt-5.6-terra | gpt-5.4-pro | Terra for reasoning, OCR for vision |

---

## 📞 Support Resources

### Microsoft Foundry
- Portal: https://ai.azure.com/
- Docs: https://learn.microsoft.com/en-us/azure/ai-foundry/
- Support: Azure portal → Help + support

### CloudInvoice Docs Location
```
c:\Users\kamle\Desktop\startup\docs\
```

### VPS-1 Logs
```bash
ssh ubuntu@161.118.176.26
cd /home/ubuntu/cloudinvoice
docker compose logs app -f
# Ctrl+C to exit
```

---

## ✅ Implementation Status

| Feature | Terra | OCR |
|---------|-------|-----|
| Agent created | ✅ | ⏳ To do |
| System prompt | ✅ | ✅ (documented) |
| Testing done | ✅ | ⏳ To do |
| Integration code | ✅ | ✅ (documented) |
| UI components | ✅ | ✅ (documented) |
| Deployed to VPS | ⏳ Pending credentials | ❌ Not created |
| Live on site | ⏳ Pending deployment | ❌ Not implemented |

---

## 🎯 Next Steps

### Immediate (Terra Agent)
1. Get Foundry credentials (Endpoint + API Key)
2. Add to VPS-1 `.env` file
3. Deploy: `git pull && docker compose up -d --build`
4. Test on https://cloudinvoice.co.in/invoices/new

### Future (OCR Agent)
1. Create CloudInvoiceOCR agent in Foundry
2. Configure gpt-5.4-pro with system prompt
3. Test with sample invoice images
4. Implement integration code (library + API + UI)
5. Deploy to VPS-1
6. Add to invoice upload workflow

---

**Last Updated:** 2026-08-12  
**Version:** 1.0  
**Status:** Terra Ready ✅ | OCR Documented ⚠️
