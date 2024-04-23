const express = require('express');
const puppeteer = require('puppeteer');
const request = require('request');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('build'));
app.use(express.text({ type: 'text/html', limit: '50mb' }));


app.use((req, res, next) => {
  const regex = /%7B|%7D|{{|}}/; 
  if (regex.test(req.url)) {
    // cтандартное изображение
    request("https://fsms.quadcode.com/storage/public/co/j5/n80r041mr5po6k6g/default_logo.png").pipe(res);
  } else {
    next();
  }
});

app.post('/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    const page = await browser.newPage();
    await page.setContent(req.body, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF: ", error);
    res.status(500).send("Failed to generate PDF: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
