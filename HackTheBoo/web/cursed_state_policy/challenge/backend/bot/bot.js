import puppeteer from 'puppeteer';
import fs from 'fs';

class Bot {
  constructor() {
    this.browser = null;
  }

  async launchBrowser() {
    if (this.browser) {
      console.log('Browser is already running.');
      return;
    }
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--js-flags=--noexpose_wasm,--jitless',
        ],
      });
      console.log('Browser launched.');
    } catch (error) {
      console.error('Error launching browser:', error.message);
      throw error;
    }
  }

  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        console.log('Browser closed.');
      } catch (error) {
        console.error('Error closing browser:', error.message);
      }
    }
  }

  async visitPage(url) {
    if (!this.browser) {
      console.error('Browser is not initialized.');
      throw new Error('Browser is not initialized.');
    }
    let page;
    try {
      page = await this.browser.newPage();

      await page.setUserAgent(
        'HackTheBoo/20.24 (Cursed; StalePolicy) CSPloitCrawler/1.1'
      );
      
      await page.setCookie({
        name: 'flag',
        value: fs.readFileSync('/flag.txt', 'utf-8').trim(),
        domain: '127.0.0.1',
        path: '/',
        httpOnly: false,
        secure: false,
      });

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      await page.close();
    } catch (error) {
      console.error('Error visiting page:', error.message);
      if (page) await page.close();
      throw error;
    }
  }

  async restartBrowser() {
    await this.closeBrowser();
    await this.launchBrowser();
  }
}

export default new Bot();
