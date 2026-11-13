const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'seo-audit-cloudinvoice-co-in-2026-08-18.docx');
const C = { navy:'1B2A4A', blue:'2563EB', green:'16A34A', amber:'D97706', red:'DC2626', light:'F8F9FA', border:'E2E8F0', text:'1E293B', pale:'EFF6FF', white:'FFFFFF', gray:'64748B', orange:'EA580C', greenPale:'F0FDF4' };
const scores = { SEO:6, GEO:5, AEO:7 };
const status = s => s >= 8 ? 'Strong' : s >= 5 ? 'On Track' : 'Needs Work';
const scoreColor = s => s >= 8 ? C.green : s >= 5 ? C.amber : C.red;
const borders = { top:{style:BorderStyle.SINGLE,size:1,color:C.border}, bottom:{style:BorderStyle.SINGLE,size:1,color:C.border}, left:{style:BorderStyle.SINGLE,size:1,color:C.border}, right:{style:BorderStyle.SINGLE,size:1,color:C.border} };
const noBorders = { top:{style:BorderStyle.NONE,size:0,color:C.white}, bottom:{style:BorderStyle.NONE,size:0,color:C.white}, left:{style:BorderStyle.NONE,size:0,color:C.white}, right:{style:BorderStyle.NONE,size:0,color:C.white} };
const txt = (text, opts={}) => new TextRun({ text, font:'Arial', color:opts.color||C.text, size:opts.size||22, bold:opts.bold, italics:opts.italics });
const p = (text, opts={}) => new Paragraph({ alignment:opts.align, spacing:{ before:opts.before||0, after:opts.after===undefined?120:opts.after, line:opts.line||300 }, children:[txt(text,opts)] });
const heading = (text, level=HeadingLevel.HEADING_1) => new Paragraph({ heading:level, spacing:{before:240,after:140}, children:[txt(text,{size:level===HeadingLevel.HEADING_1?36:28,bold:true,color:C.navy})] });
const cell = (children, opts={}) => new TableCell({ width:opts.width?{size:opts.width,type:WidthType.DXA}:undefined, shading:opts.fill?{fill:opts.fill,type:ShadingType.CLEAR}:undefined, borders:opts.noBorder?noBorders:borders, verticalAlign:VerticalAlign.CENTER, margins:{top:120,bottom:120,left:120,right:120}, children:Array.isArray(children)?children:[children] });
const row = (cells) => new TableRow({ children:cells });
const table = (rows, widths) => new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:widths, rows });
const label = (text, fill=C.navy) => p(text,{bold:true,color:C.white,size:18,align:AlignmentType.CENTER,after:0});
const statusCell = (value) => cell(p(value,{bold:true,color:C.white,size:18,align:AlignmentType.CENTER,after:0}),{fill:value==='Good'?C.green:value==='Missing'?C.red:C.amber});

const pages = [
['/','Homepage','Strong internal links and schema; current live copy is stale pending deployment.'],['/features','Core product','Good depth; H1 does not target invoice generator intent.'],['/pricing','Pricing','Clear pricing page, but paid entitlements are not implemented.'],['/templates','Templates','Strong search opportunity; claims six templates although only three render distinctly.'],['/integrations','Integrations','Useful detail; live page contradicts implemented Razorpay support.'],['/faq','FAQ','20 relevant questions and FAQ content; direct answers can be more extractable.'],['/api','API preview','Transparent boundary; should not compete for invoice-generator keywords.'],['/mission','About/mission','Good product point of view; lacks named founder/operator identity.'],['/customers','Trust page','Live version contains unsupported export, retention, and customer-use claims.'],['/changelog','Changelog','Live version contains invented releases and performance numbers.'],['/contact','Contact','Domain email present; no phone, address, or named operator.'],['/security','Trust center','Good boundaries and MSME identifier; stale authentication wording on live site.'],['/status','Status','Live page uses synthetic uptime and a vacuous operational state.'],['/privacy','Legal','Detailed but explicitly unfinished and missing legal entity.'],['/terms','Legal','Detailed but explicitly pre-launch and non-binding.'],['/cookies','Legal','Focused policy; stale fixed session-duration claim on live site.'],['/robots.txt','Technical','Conflicting Cloudflare AI crawler blocks and app-level allows.'],['/sitemap.xml','Technical','All major public routes included; lastmod is regenerated on every request.'],['/llms.txt','GEO','Present in public files; validate and update after content deployment.']
];

const keywordMap = [
['online invoice generator','Transactional','/','Online Invoice Generator for GST Invoices | CloudInvoice','Free online invoice generator for GST-ready billing','Hero, definition, process, benefits','SoftwareApplication, FAQPage'],
['create invoice free; free invoice maker','Transactional','/','same homepage cluster','Create an invoice online for free','CTA and how-to section','HowTo + SoftwareApplication'],
['online invoice builder; online invoicing software','Commercial','/features','Online Invoice Builder and Invoicing Software','Online invoice builder for small businesses','Workflow, client records, payments, analytics','SoftwareApplication, BreadcrumbList'],
['online bill generator; free bill generator; bill invoice generator','Transactional','/features','Online Bill Generator for Small Businesses','Create bills and invoices online','Invoice vs bill clarification, creation steps','FAQPage, BreadcrumbList'],
['free invoice template; download invoice template','Transactional','/templates','Free Invoice Templates for GST Billing','Free invoice templates for professional billing','Three real templates, PDF workflow, limitations','ItemList, BreadcrumbList'],
['free invoice app','Commercial','/pricing','Free Invoice App and Early Access Pricing','Use CloudInvoice free during early access','What is free, no automatic subscription','SoftwareApplication, FAQPage'],
['invoice generate online; invoiced free invoice generator','Variant/misspelling','/','Do not create separate page','Handled naturally in body/FAQ if useful','Avoid exact-match repetition','No separate schema']
];

const seoFindings = [
['Titles and H1s','Brand-led copy is polished but core pages rarely state online invoice generator, bill generator, or invoice maker intent.','Needs Attention'],
['Canonicals','Public pages use self-referencing canonical paths through Next.js metadata.','Good'],
['Index controls','Private app, auth, admin, and payment-link routes are noindex or disallowed.','Good'],
['Robots rules','Cloudflare managed directives block GPTBot, ClaudeBot, Google-Extended, and others, then app rules attempt to allow them.','Needs Attention'],
['Sitemap','Major public routes are included. lastModified uses the current request time for every URL, which is not a reliable freshness signal.','Needs Attention'],
['Content accuracy','Templates, pricing, status, customers, and changelog contain claims beyond current code on the deployed site.','Needs Attention'],
['Social metadata','Several pages have Open Graph/Twitter text, but no consistent social image is declared globally.','Needs Attention'],
['Images','Few content images exist. Existing logo assets are available, and generated previews are mostly HTML.','Good'],
['404','Local code now returns visitors to the homepage rather than sending public users to a private dashboard.','Good'],
['Performance','Next.js static rendering, next/font, and a small homepage route are positive. Field Core Web Vitals require Search Console/PageSpeed data.','Good']
];
const geoFindings = [
['Brand definition','CloudInvoice is consistently named and described as GST invoicing software for independent Indian businesses.','Good'],
['Business identity','MSME/Udyam number is visible, but the operating legal entity, registered address, founder/team, and social entity links are absent.','Missing'],
['Factual accuracy','Several deployed pages contain unsupported claims, which reduces citation trust. Local fixes are not yet live.','Needs Attention'],
['Original expertise','GST, payment verification, tenant scoping, and product limitations are explained with useful specificity.','Good'],
['Citations','Tax/GST guidance does not cite official GST sources. Add references where factual compliance guidance appears.','Needs Attention'],
['AI crawlability','Cloudflare managed robots policy blocks major AI crawlers despite later allow rules.','Missing'],
['Entity schema','Organization schema is basic and lacks legalName, identifier, contactPoint, logo asset URL, founder, and sameAs.','Needs Attention'],
['llms.txt','An llms.txt file exists, which is helpful, but it must match the deployed product and crawl policy.','Good']
];
const aeoFindings = [
['FAQ coverage','Twenty product questions cover GST, payments, templates, mobile use, privacy, and onboarding.','Good'],
['Direct answers','FAQ answers are concise, but core product pages often begin with metaphors rather than a plain definition.','Needs Attention'],
['How-to content','Workflow steps exist, but there is no indexable, question-led HowTo section for creating an invoice or GST invoice.','Missing'],
['Comparison content','Pricing has a comparison table. Invoice versus bill and template comparisons are missing.','Needs Attention'],
['Question headings','FAQ uses real questions; other pages use statement headings and miss People Also Ask opportunities.','Needs Attention'],
['FAQ schema','Homepage and feature pages emit FAQPage schema matching visible questions.','Good'],
['HowTo schema','No HowTo schema is present. Add it only when the same steps are visibly rendered.','Missing'],
['Voice readiness','Language is readable and factual in FAQ/legal pages, though some marketing copy is too abstract for direct extraction.','Needs Attention']
];
const priorities = [
['Critical','Reconcile Cloudflare and application robots rules so intended AI search crawlers are not blocked.','GEO/Technical','Medium','High'],
['Critical','Deploy the corrected status, customer, changelog, integrations, auth, and payment-confirmation copy.','Trust/SEO','Medium','High'],
['High','Map homepage to online invoice generator/create invoice free, features to invoice builder/bill generator, templates to free invoice templates.','SEO','Medium','High'],
['High','Rewrite titles, descriptions, H1s, opening definitions, and contextual links around mapped search intent.','SEO/AEO','Medium','High'],
['High','Reduce templates to the three distinct renderers and remove unsupported customization claims.','SEO/Trust','Medium','High'],
['High','Replace proposed paid entitlements with accurate early-access pricing until gating exists.','SEO/Conversion','Low','High'],
['Medium','Add visible How-to-create-an-invoice and How-to-create-a-GST-invoice sections plus accurate HowTo schema.','AEO','Medium','High'],
['Medium','Add legal entity, registered address, founder/operator, and monitored contact details after verification.','GEO/E-E-A-T','Medium','High'],
['Medium','Add Organization schema identifier/contactPoint/logo and verified sameAs profiles.','GEO','Low','Medium'],
['Quick Win','Use stable route-specific lastModified values or omit them until release dates are tracked.','Technical SEO','Low','Medium'],
['Quick Win','Add a consistent Open Graph image based on the existing generated social card.','SEO','Low','Medium'],
['Long Term','Publish sourced invoice guides: invoice vs bill, required invoice fields, numbering, payment terms, and GST basics.','Topical authority','High','High']
];

const coverScoreRows = [row(Object.entries(scores).map(([k,v])=>cell([p(k,{bold:true,color:C.white,size:20,align:AlignmentType.CENTER,after:80}),p(String(v),{bold:true,color:C.white,size:64,align:AlignmentType.CENTER,after:60}),p(status(v),{italics:true,color:C.white,size:18,align:AlignmentType.CENTER,after:0})],{fill:scoreColor(v),noBorder:true,width:3120})))];

const children = [];
children.push(new Table({width:{size:9360,type:WidthType.DXA},rows:[row([cell([p('cloudinvoice.co.in',{bold:true,color:C.white,size:72,align:AlignmentType.CENTER,before:1500,after:220}),p('SEO / GEO / AEO Audit Report',{color:'93C5FD',size:36,align:AlignmentType.CENTER,after:160}),p('FULL AUDIT',{bold:true,color:C.white,size:22,align:AlignmentType.CENTER,after:500})],{fill:C.navy,noBorder:true,width:9360})])]}));
children.push(new Table({width:{size:9360,type:WidthType.DXA},rows:coverScoreRows}));
children.push(new Table({width:{size:9360,type:WidthType.DXA},rows:[row([cell([p('Audit date: August 18, 2026',{color:'94A3B8',size:18,align:AlignmentType.CENTER,before:1500,after:80}),p('CloudInvoice internal website audit',{color:'94A3B8',size:18,align:AlignmentType.CENTER,after:0})],{fill:C.navy,noBorder:true,width:9360})])]}));
children.push(new Paragraph({children:[new PageBreak()]}));
children.push(heading('Executive summary'));
children.push(table([row([cell(p('CloudInvoice has a useful SEO foundation: clean public routes, canonical URLs, a complete sitemap, responsive rendering, FAQ content, and specific GST invoicing knowledge. The main ranking problem is intent clarity. Core pages lead with brand metaphors instead of the language people use when searching for an online invoice generator, free invoice maker, bill generator, or invoice template. GEO is held back by contradictory AI crawler rules, incomplete organization identity, and unsupported claims on the deployed site. The fastest path is to deploy the current trust corrections, assign one keyword cluster to each core page, and add visible direct answers and invoice-creation steps.',{size:22,line:330,after:0}),{fill:C.pale,width:9360})])], [9360]));
children.push(p(''));
children.push(table([
row(['Dimension','Score','Status','Key takeaway'].map((x,i)=>cell(label(x),{fill:C.navy,width:[1700,1200,1700,4760][i]}))),
...Object.entries(scores).map(([k,v])=>row([cell(p(k,{bold:true,after:0})),cell(p(`${v}/10`,{bold:true,color:C.white,align:AlignmentType.CENTER,after:0}),{fill:scoreColor(v)}),cell(p(status(v),{bold:true,after:0})),cell(p(k==='SEO'?'Strong technical base; weak keyword-to-page alignment and inaccurate deployed copy.':k==='GEO'?'Clear product entity, but crawler access and business identity need work.':'Good FAQ base; add direct definitions, visible steps, and HowTo schema.',{after:0}))])),
row([cell(p('Combined',{bold:true,after:0})),cell(p('18/30',{bold:true,after:0})),cell(p('On Track',{bold:true,after:0})),cell(p('Good foundation with high-impact trust and intent work remaining.',{after:0}))])
],[1700,1200,1700,4760]));

children.push(heading('Pages audited'));
children.push(table([row(['URL','Page type','Notes'].map((x,i)=>cell(label(x),{fill:C.navy,width:[2700,1800,4860][i]}))),...pages.map((r,i)=>row(r.map((x,j)=>cell(p(x,{size:19,after:0}),{fill:i%2?C.light:C.white,width:[2700,1800,4860][j]}))))],[2700,1800,4860]));

children.push(heading('Keyword and intent map'));
children.push(p('One page should own each search intent. Closely related variants can share a page; misspellings and awkward phrases do not justify doorway pages.'));
children.push(table([row(['Keyword cluster','Intent','Primary page','Recommended title','Recommended H1','Supporting content','Schema'].map((x,i)=>cell(label(x),{fill:C.navy,width:[1500,900,700,1600,1400,1900,1360][i]}))),...keywordMap.map((r,i)=>row(r.map((x,j)=>cell(p(x,{size:17,after:0}),{fill:i%2?C.light:C.white,width:[1500,900,700,1600,1400,1900,1360][j]}))))],[1500,900,700,1600,1400,1900,1360]));

function findingSection(titleText, score, groups) {
 children.push(heading(titleText));
 children.push(p(`Score: ${score}/10 (${status(score)})`,{bold:true,color:scoreColor(score),size:24}));
 for (const [groupTitle, findings] of groups) {
  children.push(heading(groupTitle,HeadingLevel.HEADING_2));
  children.push(table([row(['Signal','Finding','Status'].map((x,i)=>cell(label(x),{fill:C.navy,width:[1900,5660,1800][i]}))),...findings.map((r,i)=>row([cell(p(r[0],{bold:true,size:19,after:0}),{fill:i%2?C.light:C.white}),cell(p(r[1],{size:19,after:0}),{fill:i%2?C.light:C.white}),statusCell(r[2])]))],[1900,5660,1800]));
 }
}
findingSection('SEO analysis',scores.SEO,[['Technical on-page and crawlability',seoFindings.slice(0,5)],['Content quality',seoFindings.slice(5,7)],['Structured data and media',seoFindings.slice(7)]]);
findingSection('GEO analysis',scores.GEO,[['E-E-A-T assessment',geoFindings.slice(0,3)],['Content for AI synthesis',geoFindings.slice(3,5)],['Technical GEO',geoFindings.slice(5)]]);
findingSection('AEO analysis',scores.AEO,[['Featured snippet eligibility',aeoFindings.slice(0,3)],['Structured answer formats',aeoFindings.slice(3,7)],['Voice search readiness',aeoFindings.slice(7)]]);

children.push(heading('Priority recommendations'));
const prFill = x => x==='Critical'?C.red:x==='High'?C.orange:x==='Quick Win'?C.green:C.amber;
children.push(table([row(['Priority','Issue','Dimension','Effort','Impact'].map((x,i)=>cell(label(x),{fill:C.navy,width:[1300,4760,1400,900,1000][i]}))),...priorities.map((r,i)=>row([cell(p(r[0],{bold:true,color:C.white,size:18,align:AlignmentType.CENTER,after:0}),{fill:prFill(r[0])}),...r.slice(1).map((x,j)=>cell(p(x,{size:18,after:0}),{fill:i%2?C.light:C.white,width:[4760,1400,900,1000][j]}))]))],[1300,4760,1400,900,1000]));

children.push(heading("What's working well"));
const strengths = [
['Index control','Authenticated, admin, and private invoice routes are excluded from normal indexing.'],['Site discovery','Public routes are linked through navigation/footer and listed in sitemap.xml.'],['GST expertise','The site explains CGST, SGST, IGST, GSTIN, state codes, HSN, and SAC in product context.'],['Answer coverage','The FAQ addresses twenty real pre-purchase and workflow questions.'],['Trust restraint','Security pages avoid certification claims the company cannot prove.'],['Performance foundation','Next.js static output, next/font, compact route bundles, and responsive layouts support good performance.'],['Product boundary','The API page clearly says public keys are not available, which prevents misleading developer claims.']
];
children.push(table(strengths.map((r)=>row([cell(p(r[0],{bold:true,after:0}),{fill:C.greenPale,width:2100}),cell(p(r[1],{after:0}),{fill:C.greenPale,width:7260})])),[2100,7260]));

children.push(heading('Implementation plan'));
for (const [titleText, items] of [
['P0: critical',['Align Cloudflare crawler policy with intended GEO strategy.','Deploy corrected truthful content and remove synthetic status history.','Correct templates and pricing so public claims match the product.']],
['P1: high impact',['Implement the keyword map in titles, H1s, openings, and internal links.','Add direct homepage definition and visible invoice creation steps.','Create accurate SoftwareApplication, Organization, FAQPage, BreadcrumbList, and HowTo schema.']],
['P2: medium impact',['Add verified operator/legal identity and richer organization schema.','Create invoice versus bill and invoice field guides with official sources.','Use stable sitemap lastModified dates and a consistent social image.']],
['P3: long term',['Publish differentiated guides for freelancers, agencies, consultants, and contractors only when each has unique workflows.','Collect consented customer stories and original benchmark data.','Measure Core Web Vitals in Search Console and PageSpeed Insights after deployment.']]
]) { children.push(heading(titleText,HeadingLevel.HEADING_2)); items.forEach(x=>children.push(new Paragraph({bullet:{level:0},spacing:{after:100},children:[txt(x)]}))); }

children.push(heading('Glossary'));
children.push(p('SEO (search engine optimization): improvements that help search engines crawl, understand, and rank a website for relevant queries.'));
children.push(p('GEO (generative engine optimization): content and technical signals that help AI search systems understand, trust, quote, and cite a brand accurately.'));
children.push(p('AEO (answer engine optimization): structures such as direct answers, lists, tables, FAQs, and HowTo content that search and voice systems can extract.'));
children.push(p('Assessment limits: this audit reviewed crawlable content and repository implementation. Backlinks, rankings, Search Console data, and field Core Web Vitals were not available. Use Google Search Console and PageSpeed Insights for those measurements.'));

const header = new Header({children:[new Table({width:{size:9360,type:WidthType.DXA},rows:[row([cell(p('cloudinvoice.co.in',{bold:true,color:C.navy,size:18,after:0}),{noBorder:true,width:4680}),cell(p('SEO / GEO / AEO Audit Report',{color:C.gray,size:18,align:AlignmentType.RIGHT,after:0}),{noBorder:true,width:4680})])]}),new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:8,color:C.navy}},children:[]})]});
const footer = new Footer({children:[new Paragraph({border:{top:{style:BorderStyle.SINGLE,size:4,color:C.border}},children:[]}),new Table({width:{size:9360,type:WidthType.DXA},rows:[row([cell(p('CloudInvoice internal website audit',{color:C.gray,size:16,after:0}),{noBorder:true,width:4680}),cell(new Paragraph({alignment:AlignmentType.RIGHT,children:[txt('Page ',{color:C.gray,size:16}),new TextRun({children:[PageNumber.CURRENT],font:'Arial',color:C.gray,size:16})]}),{noBorder:true,width:4680})])]} )]});

const doc = new Document({
 styles:{default:{document:{run:{font:'Arial',size:22,color:C.text},paragraph:{spacing:{line:300}}}}},
 sections:[
  { properties:{page:{size:{width:12240,height:15840},margin:{top:720,right:1440,bottom:720,left:1440}},type:'nextPage'}, children:children.slice(0,4) },
  { properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}},type:'nextPage'}, headers:{default:header},footers:{default:footer},children:children.slice(4) }
 ]
});
Packer.toBuffer(doc).then(buffer=>{fs.writeFileSync(OUT,buffer);console.log(OUT);}).catch(err=>{console.error(err);process.exit(1);});
