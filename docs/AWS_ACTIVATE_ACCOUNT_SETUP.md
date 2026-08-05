# AWS Activate Account Setup Guide

## 🎯 Why Separate Accounts?

**Production Account** (Current - 54.151.245.180):
- Running live CloudInvoice application
- Real customer data
- Stable infrastructure
- Don't touch this!

**AWS Activate Account** (New - For Credits):
- Apply for AWS Activate credits here
- Use credits for scaling/development
- Keep separate from production for safety
- Migrate services gradually

---

## 📋 Step-by-Step: Create AWS Activate Account

### **Step 1: Create New AWS Account**

1. **Open Incognito/Private Browser**
   - Don't use your existing AWS session
   - Use: Chrome Incognito or Firefox Private

2. **Go to AWS Signup**
   - URL: https://portal.aws.amazon.com/billing/signup

3. **Email Address** (IMPORTANT):
   - ✅ **Use**: `activate@cloudinvoice.co.in` or `credits@cloudinvoice.co.in`
   - ❌ **Don't use**: Personal Gmail or your production AWS email
   - ❌ **Don't use**: Same email as production account

4. **AWS Account Name**:
   - Enter: `CloudInvoice Activate` or `CloudInvoice Credits`
   - This helps you identify which account is which

5. **Password**:
   - Create strong password (save in password manager)
   - Don't use same password as production account

6. **Click**: "Verify email address"
   - Check email and enter verification code

---

### **Step 2: Contact Information**

1. **Account Type**: Select **Business**
   - Better for startup applications

2. **Full Name**: Your name (or company authorized person)

3. **Company Name**: 
   - Enter: `CloudInvoice` or your legal entity name

4. **Country**: India

5. **Address**: Your business address
   - Use real address (AWS may verify)

6. **Phone Number**: 
   - Use business phone
   - Format: +91-XXXXXXXXXX

7. **Click**: Continue

---

### **Step 3: Payment Information**

⚠️ **IMPORTANT**: AWS requires credit/debit card even for free tier

**Options:**

**Option A: Use Credit Card**
- Enter card details
- AWS will charge ₹2 for verification (refunded immediately)
- This is standard practice

**Option B: Virtual Card** (Recommended for separate account)
- Get virtual card from: Niyo, Fi Money, or Jupiter
- Use this card only for AWS Activate account
- Helps track any charges separately

**What to Enter:**
- Card number
- Expiry date
- CVV
- Billing address (same as contact address)

**Click**: Verify and Add

---

### **Step 4: Identity Verification**

**Phone Verification:**
1. Enter your mobile number: +91-XXXXXXXXXX
2. Choose: "Text message (SMS)" or "Voice call"
3. Enter 4-digit PIN when received
4. Click: "Verify Code"

---

### **Step 5: Select Support Plan**

**Choose**: ✅ **Basic support - Free**
- Don't select paid plans
- You can upgrade later if needed

**Click**: Complete sign up

---

### **Step 6: Welcome to AWS!**

✅ **Account Created Successfully!**

You'll see:
- "Welcome to Amazon Web Services"
- Your AWS Account ID (12 digits) - **SAVE THIS!**

**IMPORTANT**: Write down your **AWS Account ID**
- Format: `123456789012`
- You'll need this for AWS Activate application

---

## 📝 Account Setup Checklist

After account creation, do these immediately:

### **1. Enable MFA (Multi-Factor Authentication)**

```
1. Sign in to AWS Console
2. Click your name (top right) → Security Credentials
3. Scroll to "Multi-factor authentication (MFA)"
4. Click "Assign MFA device"
5. Choose "Virtual MFA device"
6. Use Google Authenticator or Authy app
7. Scan QR code
8. Enter two consecutive MFA codes
9. Click "Assign MFA"
```

✅ **Critical for security!**

---

### **2. Set Billing Alerts**

Prevent surprise charges:

```
1. Go to Billing Dashboard
2. Click "Billing preferences"
3. Enable:
   ✅ "Receive Free Tier Usage Alerts"
   ✅ "Receive Billing Alerts"
4. Enter email: activate@cloudinvoice.co.in
5. Save preferences

6. Go to CloudWatch → Alarms → Billing
7. Create alarm:
   - Threshold: $10 (you'll get alert if charges exceed $10)
   - Email: activate@cloudinvoice.co.in
```

---

### **3. Save Account Details**

Create a secure note with:

```
AWS ACTIVATE ACCOUNT
-------------------
AWS Account ID: [12-digit number]
Root Email: activate@cloudinvoice.co.in
Root Password: [saved in password manager]
MFA Device: [Google Authenticator]
Card Used: [last 4 digits]
Created Date: [today's date]
Purpose: AWS Activate Credits Application

PRODUCTION ACCOUNT (DO NOT MIX)
-------------------------------
AWS Account ID: [different 12-digit number]
Email: [different email]
EC2 Instance: 54.151.245.180
Purpose: Live CloudInvoice Production
```

---

## 🎯 AWS Activate Application (Using New Account)

### **Step 1: Prepare Information**

Before applying, have ready:

```
✅ AWS Account ID: [from new account]
✅ Company Name: CloudInvoice
✅ Website: https://cloudinvoice.co.in
✅ Business Email: info@cloudinvoice.co.in (or activate@)
✅ Founder LinkedIn: [your profile URL]
✅ Description: GST-compliant invoicing SaaS for Indian businesses
✅ Current Traction:
   - Users: [actual count]
   - Revenue: ₹[actual MRR]
   - Growth: [%] MoM
```

---

### **Step 2: Apply for AWS Activate**

1. **Go to AWS Activate Portal**
   - URL: https://aws.amazon.com/activate/portfolio-signup

2. **Sign in with NEW AWS account**
   - Use: activate@cloudinvoice.co.in
   - Don't use production account!

3. **Fill Application Form**:

**Organization Details:**
```
Company Name: CloudInvoice
Website: https://cloudinvoice.co.in
Industry: Software & Internet
Employee Count: 1-10
Country: India
```

**Founder Details:**
```
Name: [Your Name]
Email: info@cloudinvoice.co.in
Title: Founder & CEO
LinkedIn: [Your LinkedIn URL]
```

**Product Details:**
```
Product Description:
CloudInvoice is a GST-compliant invoicing and payment collection 
platform for Indian businesses. We help freelancers, agencies, and 
SMBs create professional invoices, collect payments via Razorpay/Stripe, 
and manage clients in one place.

Stage: Launched / Early Stage
Launch Date: July 2026
Traction: [X] users, ₹[Y] processed, [Z]% MoM growth
```

**AWS Usage Plan:**
```
Current Monthly Spend: $30-50 (EC2 + PostgreSQL)

Planned Services with Credits:
- Amazon RDS (PostgreSQL): $80-150/mo
- Amazon S3: $20-50/mo
- Amazon CloudFront: $30-100/mo
- Amazon SES: $10-20/mo
- Amazon Lambda: $10-30/mo
- Amazon ElastiCache: $50-100/mo

Estimated Monthly: $200-450
6-month projection: $2,700

Why we need AWS:
1. Compliance: SOC 2 infrastructure for enterprise clients
2. Scalability: Expecting 10x growth in 6 months
3. Global expansion: Multi-region deployment needed
4. Performance: Redis caching, CDN for faster load times
```

**Funding Status:**
```
Stage: Bootstrapped / Pre-seed
Funding Raised: ₹[Amount] or None
Associated with: [Accelerator name if any, or "None"]
```

4. **Submit Application**

5. **Wait for Response** (5-7 business days)

---

## 📊 Track Both Accounts

Create a spreadsheet:

| Purpose | Account Type | Email | Account ID | Current Usage | Credits |
|---------|--------------|-------|------------|---------------|---------|
| Production | Live App | [prod email] | [prod ID] | EC2, PostgreSQL | None |
| Activate | Credits | activate@cloudinvoice.co.in | [new ID] | None yet | Pending $1K-25K |

---

## ⚠️ Common Mistakes to Avoid

❌ **DON'T:**
- Use same email for both accounts
- Apply for credits on production account
- Share account credentials
- Forget to enable MFA
- Use personal Gmail for activate account

✅ **DO:**
- Keep accounts completely separate
- Use business email domain
- Enable billing alerts on both
- Save both account IDs separately
- Apply to accelerators first (better credits)

---

## 🚀 Next Steps After Approval

Once you get AWS Activate credits:

**Week 1:**
- [ ] Verify credits appear in billing console
- [ ] Set up services in Activate account
- [ ] Test migration plan with non-critical service

**Week 2-4:**
- [ ] Create staging environment in Activate account
- [ ] Migrate database to RDS
- [ ] Set up S3 for file storage
- [ ] Configure CloudFront CDN

**Month 2+:**
- [ ] Consider gradual production migration
- [ ] Or keep production separate and use credits for dev/staging
- [ ] Monitor credit usage monthly

---

## 📞 Support

**If Application Gets Rejected:**
- Wait 3 months
- Get more traction (users, revenue)
- Apply to accelerator first
- Reapply with stronger metrics

**If You Need Help:**
- AWS Activate Support: aws-activate@amazon.com
- AWS India Team: Through support console
- Community: r/aws on Reddit

---

## 📝 Final Checklist Before Applying

- [ ] New AWS account created (separate from production)
- [ ] Business email used (not personal Gmail)
- [ ] MFA enabled
- [ ] Billing alerts set
- [ ] Account ID saved
- [ ] LinkedIn profile updated
- [ ] Website live (https://cloudinvoice.co.in)
- [ ] Traction metrics ready
- [ ] Usage plan documented
- [ ] All details match (website, LinkedIn, application)

**Ready to apply!** 🚀

---

**Last Updated**: August 5, 2026  
**For**: CloudInvoice AWS Activate Application
