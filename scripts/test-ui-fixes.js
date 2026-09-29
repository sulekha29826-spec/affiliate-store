import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Test 1: Mobile PDP Check by navigating to live product
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto('https://affiliate-store-kohl.vercel.app/', { waitUntil: 'networkidle2' });

  const productUrl = 'https://affiliate-store-kohl.vercel.app/product/prod_sony_xm5';
  console.log('Navigating directly to PDP:', productUrl);
  await page.goto(productUrl, { waitUntil: 'networkidle2' });
  await page.waitForSelector('button[aria-label="Open SastaAI Assistant"]', { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));

  const pdpMetrics = await page.evaluate(() => {
    const currentUrl = window.location.href;
    const stickyBar = document.querySelector('.sm\\:hidden.fixed.bottom-0');
    const stickyBuyBtn = stickyBar ? stickyBar.querySelector('button') : null;
    const fabButton = document.querySelector('button[aria-label="Open SastaAI Assistant"]');

    const stickyRect = stickyBar ? stickyBar.getBoundingClientRect() : null;
    const buyRect = stickyBuyBtn ? stickyBuyBtn.getBoundingClientRect() : null;
    const fabRect = fabButton ? fabButton.getBoundingClientRect() : null;

    return {
      currentUrl,
      stickyBarFound: !!stickyBar,
      stickyTop: stickyRect ? Math.round(stickyRect.top) : null,
      stickyBottom: stickyRect ? Math.round(stickyRect.bottom) : null,
      buyButtonText: stickyBuyBtn ? stickyBuyBtn.innerText.replace(/\s+/g, ' ').trim() : null,
      buyRect: buyRect ? { top: Math.round(buyRect.top), bottom: Math.round(buyRect.bottom), right: Math.round(buyRect.right) } : null,
      fabRect: fabRect ? { top: Math.round(fabRect.top), bottom: Math.round(fabRect.bottom), right: Math.round(fabRect.right) } : null,
      fabIsAboveSticky: fabRect && stickyRect ? fabRect.bottom <= stickyRect.top : null,
      clearanceBetweenFabAndSticky: fabRect && stickyRect ? Math.round(stickyRect.top - fabRect.bottom) : null
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
  console.log('All verification checks completed successfully!');
})();
