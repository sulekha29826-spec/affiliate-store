import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Test 1: Mobile PDP Check
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto('https://affiliate-store-kohl.vercel.app/product/boat-airdopes-141-anc', { waitUntil: 'networkidle2' });

  const pdpMetrics = await page.evaluate(() => {
    // Mobile sticky buy button
    const stickyBar = document.querySelector('.fixed.bottom-0');
    const stickyBuyBtn = stickyBar ? stickyBar.querySelector('button') : null;
    const fabButton = document.querySelector('button[aria-label="Open SastaAI Assistant"]');

    const stickyRect = stickyBar ? stickyBar.getBoundingClientRect() : null;
    const buyRect = stickyBuyBtn ? stickyBuyBtn.getBoundingClientRect() : null;
    const fabRect = fabButton ? fabButton.getBoundingClientRect() : null;

    return {
      stickyBarFound: !!stickyBar,
      stickyTop: stickyRect?.top,
      stickyBottom: stickyRect?.bottom,
      buyButtonText: stickyBuyBtn?.innerText?.trim(),
      buyRect: buyRect ? { top: buyRect.top, bottom: buyRect.bottom } : null,
      fabRect: fabRect ? { top: fabRect.top, bottom: fabRect.bottom } : null,
      fabIsAboveSticky: fabRect && stickyRect ? fabRect.bottom < stickyRect.top : null,
      gapBetweenFabAndSticky: fabRect && stickyRect ? Math.round(stickyRect.top - fabRect.bottom) : null
    };
  });
  console.log('PDP Metrics:', JSON.stringify(pdpMetrics, null, 2));

  // Test 2: Search Dropdown Width & Fit on Mobile
  await page.goto('https://affiliate-store-kohl.vercel.app/', { waitUntil: 'networkidle2' });
  await page.focus('input[type="text"]');
  await page.type('input[type="text"]', 'boat');
  await new Promise((r) => setTimeout(r, 800));

  const searchMetrics = await page.evaluate(() => {
    const popup = document.querySelector('div.shadow-2xl');
    const rect = popup ? popup.getBoundingClientRect() : null;
    const items = popup ? Array.from(popup.querySelectorAll('button p')).map((p) => p.innerText.trim()) : [];

    return {
      popupFound: !!popup,
      popupWidth: rect ? Math.round(rect.width) : 0,
      viewportWidth: window.innerWidth,
      widthPercentage: rect ? Math.round((rect.width / window.innerWidth) * 100) : 0,
      itemCount: items.length,
      sampleItemTitle: items[0] || null
    };
  });
  console.log('Search Dropdown Metrics:', JSON.stringify(searchMetrics, null, 2));

  await browser.close();
  console.log('Verification finished successfully!');
})();
