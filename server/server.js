const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('build'));

app.use(express.text({ type: 'text/html', limit: '50mb' }));

app.post('/generate-pdf', async (req, res) => {
  const html = req.body;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  res.contentType('application/pdf');
  res.send(pdf);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
