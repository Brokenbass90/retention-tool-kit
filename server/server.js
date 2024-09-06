const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const request = require('request');
const app = express();
const port = process.env.PORT || 3001;

const brandsFilePath = path.join(__dirname, 'brands.json');
const templatesFilePath = path.join(__dirname, 'templates.json'); 

app.use(express.static('build'));
app.use(express.json());
app.use(express.text({ type: 'text/html', limit: '50mb' }));

app.use((req, res, next) => {
  const regex = /%7B|%7D|{{|}}/;
  if (regex.test(req.url)) {
    request("https://fsms.quadcode.com/storage/public/co/j5/n80r041mr5po6k6g/default_logo.png").pipe(res);
  } else {
    next();
  }
});

// Генерация PDF
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
      ]
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



// Эндпоинт для получения всех брендов
app.get('/api/brands', (req, res) => {
  fs.readFile(brandsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).send('Failed to read brands file');
    }
    try {
      const brands = JSON.parse(data);
      res.json(brands);
    } catch (parseErr) {
      console.error('Error parsing brands.json:', parseErr);
      return res.status(500).send('Failed to parse brands file');
    }
  });
});

// Эндпоинт для добавления нового бренда
app.post('/api/brands', (req, res) => {
  fs.readFile(brandsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).json({ error: 'Failed to read brands file' });
    }

    const brands = JSON.parse(data);
    brands.push(req.body);

    fs.writeFile(brandsFilePath, JSON.stringify(brands, null, 2), (err) => {
      if (err) {
        console.error('Error writing to brands.json:', err);
        return res.status(500).json({ error: 'Failed to save brand' });
      }

      res.status(201).json({ message: 'Brand saved successfully' });
    });
  });
});

// Эндпоинт для удаления бренда по имени
app.delete('/api/brands/:brandName', (req, res) => {
  const brandNameToDelete = req.params.brandName;

  fs.readFile(brandsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).json({ error: 'Failed to read brands file' });
    }

    let brands = JSON.parse(data);
    const initialLength = brands.length;
    brands = brands.filter(brand => brand.brandName !== brandNameToDelete);

    if (brands.length === initialLength) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    fs.writeFile(brandsFilePath, JSON.stringify(brands, null, 2), (err) => {
      if (err) {
        console.error('Error writing to brands.json:', err);
        return res.status(500).json({ error: 'Failed to delete brand' });
      }

      res.status(200).json({ message: 'Brand deleted successfully' });
    });
  });
});

// Новый функционал для работы с шаблонами

// Эндпоинт для получения всех шаблонов
app.get('/api/templates', (req, res) => {
  fs.readFile(templatesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).send('Failed to read templates file');
    }
    try {
      const templates = JSON.parse(data);
      res.json(templates);
    } catch (parseErr) {
      console.error('Error parsing templates.json:', parseErr);
      return res.status(500).send('Failed to parse templates file');
    }
  });
});

// Эндпоинт для добавления нового шаблона
app.post('/api/templates', (req, res) => {
  fs.readFile(templatesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).json({ error: 'Failed to read templates file' });
    }

    const templates = JSON.parse(data);
    templates.push(req.body);

    fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2), (err) => {
      if (err) {
        console.error('Error writing to templates.json:', err);
        return res.status(500).json({ error: 'Failed to save template' });
      }

      res.status(201).json({ message: 'Template saved successfully' });
    });
  });
});

// Эндпоинт для удаления шаблона по имени
app.delete('/api/templates/:templateName', (req, res) => {
  const templateNameToDelete = req.params.templateName;

  fs.readFile(templatesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).json({ error: 'Failed to read templates file' });
    }

    let templates = JSON.parse(data);
    const initialLength = templates.length;
    templates = templates.filter(template => template.name !== templateNameToDelete);

    if (templates.length === initialLength) {
      return res.status(404).json({ error: 'Template not found' });
    }

    fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2), (err) => {
      if (err) {
        console.error('Error writing to templates.json:', err);
        return res.status(500).json({ error: 'Failed to delete template' });
      }

      res.status(200).json({ message: 'Template deleted successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
