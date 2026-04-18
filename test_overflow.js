const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 730 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  async function getWidths() {
    return await page.evaluate(() => {
      const grid = document.querySelector('.Suggestions-grid');
      const root = document.querySelector('.DailySuggestions-root');
      return {
        gridWidth: grid ? grid.offsetWidth : 0,
        gridScroll: grid ? grid.scrollWidth : 0,
        rootWidth: root ? root.offsetWidth : 0,
        rootScroll: root ? root.scrollWidth : 0,
        docScroll: document.documentElement.scrollWidth,
        docClient: document.documentElement.clientWidth
      };
    });
  }

  console.log('Initial:', await getWidths());

  for (let i = 1; i <= 3; i++) {
    const btn = await page.$('.load-more-btn');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(2000); // wait for load
      console.log(`After click ${i}:`, await getWidths());
    } else {
      console.log('Button not found');
      break;
    }
  }

  // Find the exact element causing overflow
  const overflowElement = await page.evaluate(() => {
    let maxW = document.documentElement.clientWidth;
    let worst = null;
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > maxW) {
        maxW = el.scrollWidth;
        worst = el.className || el.tagName;
      }
    });
    return { className: worst, scrollWidth: maxW };
  });

  console.log('Worst overflowing element:', overflowElement);

  await browser.close();
})();
