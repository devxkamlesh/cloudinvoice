# 🤖 Microsoft Foundry AI Integration - Deployment Guide

## ✅ What's Done

- ✅ Terra AI agent (gpt-5.6-terra) tested successfully with 6 capabilities
- ✅ AI integration code completed and pushed to GitHub
- ✅ UI components created for natural language invoice generation
- ✅ API route `/api/ai/generate-invoice` implemented
- ✅ Environment variables documented in `.env.example`

## 🚀 Next Steps - Deploy to VPS-1

### Step 1: Get Microsoft Foundry Credentials

1. Go to **Microsoft Foundry**: https://ai.azure.com/
2. Navigate to your project: **CloudinvoiceAgent**
3. Click **"Publish"** button (top right)
4. Go to **"Details"** tab
5. Copy these two values:
   - **Endpoint URL** (looks like: `https://xxxxx.foundry.ml.azure.com/v1/chat/completions`)
   - **API Key** (long string starting with letters/numbers)

### Step 2: Add Credentials to VPS-1

SSH into VPS-1 and edit the environment file:

```bash
# SSH into VPS-1
ssh ubuntu@161.118.176.26

# Navigate to CloudInvoice directory
cd /home/ubuntu/cloudinvoice

# Edit .env file
nano .env
```

Add these two lines at the end of the file:

```env
# Microsoft Foundry AI (CloudInvoice Agent)
FOUNDRY_ENDPOINT="paste-your-endpoint-url-here"
FOUNDRY_API_KEY="paste-your-api-key-here"
```

**Important:**
- Replace `paste-your-endpoint-url-here` with actual endpoint from Foundry
- Replace `paste-your-api-key-here` with actual API key from Foundry
- Keep the quotes around the values

Save and exit (Ctrl+X, then Y, then Enter)

### Step 3: Pull Latest Code & Rebuild

Still in VPS-1 SSH session:

```bash
# Pull latest code from GitHub
git pull origin main

# Rebuild and restart the app
docker compose down
docker compose up -d --build

# Check if app is running
docker compose ps

# Check logs for any errors
docker compose logs app -f
```

Press `Ctrl+C` to exit logs when you see "ready" messages.

### Step 4: Test AI Integration

1. Open browser: https://cloudinvoice.co.in/invoices/new
2. You should see a new purple/blue gradient box at the top: **"AI Invoice Generator"**
3. Type a test prompt:
   ```
   Website redesign for Tech Solutions, 60 hours at ₹2000/hr, 18% GST
   ```
4. Click **"Generate Invoice"** button
5. You should see generated invoice data below with:
   - Client details (if provided)
   - Line items with HSN/SAC codes
   - Calculated amounts
   - Tax mode and due date

### Step 5: Verify Functionality

Test different prompts:

**Test 1: Simple Invoice**
```
Mobile app development, 100 hours @ ₹3000/hr
```

**Test 2: With Client Details**
```
Create invoice for Acme Corp (acme@example.com), consulting services, 
40 hours at ₹5000 per hour, GSTIN: 29AAACI1234F1Z5
```

**Test 3: Multiple Items**
```
Invoice for Tech Solutions:
- Web design: 20 hours @ ₹2000
- Backend API: 30 hours @ ₹3000
- Testing: 10 hours @ ₹1500
Due in 30 days
```

## 🎯 Features Included

### 1. Invoice Generation (✅ Working)
- Natural language input
- Auto-detects HSN/SAC codes
- Calculates GST rates
- Extracts client information
- Sets due dates intelligently

### 2. What AI Can Do
- Parse quantities and rates (e.g., "40 hours at ₹2500")
- Understand Indian number formats (₹50k = ₹50,000)
- Apply correct HSN/SAC codes for IT services
- Detect intra-state vs inter-state transactions
- Calculate due dates from phrases like "Net 30" or "in 15 days"

### 3. UI Features
- Beautiful gradient card design
- Real-time generation with loading state
- Visual preview of generated data
- Copy-to-clipboard functionality
- Expandable help section

## 🔧 Troubleshooting

### Error: "AI features are not configured"
- ❌ FOUNDRY_ENDPOINT or FOUNDRY_API_KEY missing from `.env`
- ✅ Add credentials and restart: `docker compose restart app`

### Error: "Foundry API error (401)"
- ❌ Invalid API key
- ✅ Double-check API key from Foundry Details tab

### Error: "Foundry API error (404)"
- ❌ Wrong endpoint URL
- ✅ Verify endpoint URL ends with `/v1/chat/completions`

### Error: "Failed to parse AI response"
- ❌ AI returned non-JSON (rare, agent is well-trained)
- ✅ Check Foundry → CloudinvoiceAgent → Traces for actual response

### AI button not appearing
- ❌ Code not deployed or build failed
- ✅ Check: `docker compose logs app | grep -i error`
- ✅ Rebuild: `docker compose up -d --build`

## 📊 Monitoring

### Check AI Usage
1. Go to **Microsoft Foundry** → **CloudinvoiceAgent**
2. Click **"Monitor"** tab
3. View:
   - Request count
   - Token usage
   - Response times
   - Error rates

### Check Application Logs
```bash
# On VPS-1
docker compose logs app -f

# Look for these log lines:
# ✅ "POST /api/ai/generate-invoice 200" (success)
# ❌ "POST /api/ai/generate-invoice 500" (error)
```

## 🎨 Future Enhancements (Not Implemented Yet)

### Phase 2: Auto-Fill Form
- Generate → Click "Auto-fill" → Form populates automatically
- Requires form state management integration

### Phase 3: More AI Features
- Payment reminder generation
- Client data extraction from business cards
- Smart invoice search
- Tax calculations
- Business insights

### Phase 4: Invoice OCR
- Upload invoice image → Extract data
- Uses separate gpt-5.4-pro model (vision-capable)
- Different agent: **CloudInvoiceOCR**

## 🔐 Security Notes

- ✅ API keys stored in `.env` (not in code)
- ✅ `.env` is gitignored (never committed)
- ✅ API requests server-side only (Next.js API route)
- ✅ User prompts limited to 2000 characters
- ✅ Rate limiting recommended (add Upstash Redis later)

## 📞 Support

If you encounter issues:

1. Check VPS-1 logs: `docker compose logs app -f`
2. Check Foundry traces: Microsoft Foundry → CloudinvoiceAgent → Traces
3. Verify credentials in `/home/ubuntu/cloudinvoice/.env`
4. Ensure app is running: `docker compose ps`

---

**Status**: Ready for deployment! 🚀

Test the 6 AI capabilities and let me know if you need any adjustments!
