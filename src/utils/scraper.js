const puppeteer = require('puppeteer');

async function scrapeUrl(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Go to URL and wait until the network is mostly idle
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Extract the inner text of the body
        const text = await page.evaluate(() => {
            return document.body ? document.body.innerText : '';
        });

        // Slice if it's absurdly long to prevent token overflow
        return text.substring(0, 15000); 
    } catch (error) {
        console.error('Error scraping URL:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { scrapeUrl };
