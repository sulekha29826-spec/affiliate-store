import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PREVIEWS_DIR = path.join(ROOT_DIR, 'ui-previews');

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';

const BASE_STORE_URL = process.env.BASE_STORE_URL || 'https://affiliate-store-kohl.vercel.app';
const BASE_ADMIN_URL = process.env.BASE_ADMIN_URL || 'https://admin-livid-six.vercel.app';

const PAGES_TO_AUDIT = [
  { name: '01_homepage_desktop', url: `${BASE_STORE_URL}/`, width: 1280, height: 900, isMobile: false },
  { name: '02_homepage_mobile', url: `${BASE_STORE_URL}/`, width: 375, height: 812, isMobile: true },
  { name: '03_category_electronics_desktop', url: `${BASE_STORE_URL}/category/electronics`, width: 1280, height: 900, isMobile: false },
  { name: '04_category_electronics_mobile', url: `${BASE_STORE_URL}/category/electronics`, width: 375, height: 812, isMobile: true },
  { name: '05_search_boat_desktop', url: `${BASE_STORE_URL}/search?q=boat`, width: 1280, height: 900, isMobile: false },
  { name: '06_search_boat_mobile', url: `${BASE_STORE_URL}/search?q=boat`, width: 375, height: 812, isMobile: true },
  { name: '07_product_detail_desktop', url: `${BASE_STORE_URL}/product/boat-airdopes-141-anc-bluetooth-wireless-earbuds`, width: 1280, height: 900, isMobile: false },
  { name: '08_product_detail_mobile', url: `${BASE_STORE_URL}/product/boat-airdopes-141-anc-bluetooth-wireless-earbuds`, width: 375, height: 812, isMobile: true },
  { name: '09_admin_dashboard_desktop', url: `${BASE_ADMIN_URL}/`, width: 1280, height: 900, isMobile: false }
];

async function runAudit() {
  console.log('🚀 Starting SastaBazar Automated UI & Visual Audit with Chromium...');
  console.log(`🌐 Storefront: ${BASE_STORE_URL}`);
  console.log(`🛠️ Admin: ${BASE_ADMIN_URL}`);
  console.log(`🔍 Chromium Binary: ${CHROMIUM_PATH}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none'
      ]
    });
  } catch (err) {
    console.error('Failed to launch Chromium:', err.message);
    process.exit(1);
  }

  const auditReport = {
    timestamp: new Date().toISOString(),
    pagesAudited: [],
    totalIssuesFound: 0,
    issues: []
  };

  for (const pageConfig of PAGES_TO_AUDIT) {
    console.log(`\n📸 Auditing: [${pageConfig.name}] -> ${pageConfig.url} (${pageConfig.width}x${pageConfig.height})`);
    const page = await browser.newPage();
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    try {
      await page.setViewport({
        width: pageConfig.width,
        height: pageConfig.height,
        isMobile: pageConfig.isMobile,
        hasTouch: pageConfig.isMobile,
        deviceScaleFactor: 2
      });

      await page.goto(pageConfig.url, {
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 30000
      });

      // Extra wait for animations and fonts to settle
      await new Promise((r) => setTimeout(r, 1500));

      // Automated DOM & UI Health Inspection
      const pageHealth = await page.evaluate(() => {
        const issues = [];

        // Check 1: Horizontal Scroll Overflow (Crucial for Mobile)
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        if (scrollWidth > clientWidth + 2) {
          issues.push({
            type: 'HORIZONTAL_OVERFLOW',
            severity: 'HIGH',
            detail: `Page body width (${scrollWidth}px) exceeds viewport width (${clientWidth}px) by ${scrollWidth - clientWidth}px. Causes unwanted side-scrolling on mobile!`
          });
        }

        // Check 2: Broken Images
        const brokenImages = [];
        document.querySelectorAll('img').forEach((img) => {
          if (!img.complete || img.naturalWidth === 0) {
            brokenImages.push({
              src: img.src,
              alt: img.alt || '[NO_ALT]'
            });
          }
        });
        if (brokenImages.length > 0) {
          issues.push({
            type: 'BROKEN_IMAGES',
            severity: 'HIGH',
            count: brokenImages.length,
            detail: brokenImages.slice(0, 5)
          });
        }

        // Check 3: Missing Alt Attributes
        const missingAltImages = [];
        document.querySelectorAll('img:not([alt]), img[alt=""]').forEach((img) => {
          missingAltImages.push(img.src.slice(0, 60));
        });
        if (missingAltImages.length > 0) {
          issues.push({
            type: 'MISSING_IMAGE_ALT',
            severity: 'MEDIUM',
            count: missingAltImages.length,
            detail: missingAltImages.slice(0, 5)
          });
        }

        // Check 4: Touch Target Sizes on Mobile (< 36px height or width)
        const smallTouchTargets = [];
        document.querySelectorAll('button, a, input, select').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
            const text = (el.innerText || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 25);
            smallTouchTargets.push({
              tag: el.tagName.toLowerCase(),
              text: text || '[ICON]',
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            });
          }
        });
        if (smallTouchTargets.length > 0) {
          issues.push({
            type: 'SMALL_TOUCH_TARGETS',
            severity: 'LOW',
            count: smallTouchTargets.length,
            detail: smallTouchTargets.slice(0, 5)
          });
        }

        // Check 5: Page Title & Meta Description
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.content;

        return {
          title,
          hasMetaDesc: !!metaDesc,
          issues
        };
      });

      // Capture Screenshot
      const screenshotPath = path.join(PREVIEWS_DIR, `${pageConfig.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });

      console.log(`  ✅ Screenshot saved: ui-previews/${pageConfig.name}.png`);
      if (consoleErrors.length > 0) {
        console.warn(`  ⚠️ Console Errors (${consoleErrors.length}):`, consoleErrors.slice(0, 3));
      }
      if (pageHealth.issues.length > 0) {
        console.warn(`  ⚠️ UI Issues Detected:`, pageHealth.issues.map(i => `${i.type} (${i.severity})`));
      }

      auditReport.pagesAudited.push({
        name: pageConfig.name,
        url: pageConfig.url,
        title: pageHealth.title,
        viewport: `${pageConfig.width}x${pageConfig.height}`,
        consoleErrors: consoleErrors.slice(0, 5),
        issues: pageHealth.issues
      });

      auditReport.totalIssuesFound += pageHealth.issues.length + (consoleErrors.length > 0 ? 1 : 0);

      await page.close();
    } catch (pageErr) {
      console.error(`  ❌ Error auditing ${pageConfig.name}:`, pageErr.message);
      await page.close();
    }
  }

  await browser.close();

  const reportPath = path.join(PREVIEWS_DIR, 'audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));

  console.log('\n======================================================');
  console.log('📊 AUDIT SUMMARY:');
  console.log(`Total Pages Inspected: ${auditReport.pagesAudited.length}`);
  console.log(`Total Issues Flagged: ${auditReport.totalIssuesFound}`);
  console.log(`Audit Report File: ui-previews/audit_report.json`);
  console.log('======================================================\n');
}

runAudit().catch(console.error);
