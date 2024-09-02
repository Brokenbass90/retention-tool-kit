"use strict";

// const express = require('express');
// const puppeteer = require('puppeteer');
// const request = require('request');
// const app = express();
// const port = process.env.PORT || 3001;
// app.use(express.static('build'));
// app.use(express.text({ type: 'text/html', limit: '50mb' }));
// app.use((req, res, next) => {
//   const regex = /%7B|%7D|{{|}}/; 
//   if (regex.test(req.url)) {
//     // cтандартное изображение
//     request("https://fsms.quadcode.com/storage/public/co/j5/n80r041mr5po6k6g/default_logo.png").pipe(res);
//   } else {
//     next();
//   }
// });
// app.post('/generate-pdf', async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-accelerated-2d-canvas',
//         '--no-first-run',
//         '--no-zygote',
//         '--single-process',
//         '--disable-gpu'
//       ],
//       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
//     });
//     const page = await browser.newPage();
//     await page.setContent(req.body, { waitUntil: 'networkidle0' });
//     const pdf = await page.pdf({ format: 'A4', printBackground: true });
//     await browser.close();
//     res.contentType('application/pdf');
//     res.send(pdf);
//   } catch (error) {
//     console.error("Error generating PDF: ", error);
//     res.status(500).send("Failed to generate PDF: " + error.message);
//   }
// });
// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
var express = require('express');

var puppeteer = require('puppeteer');

var request = require('request');

var fs = require('fs');

var path = require('path');

var app = express();
var port = process.env.PORT || 3001;
app.use(express["static"]('build'));
app.use(express.text({
  type: 'text/html',
  limit: '50mb'
}));
app.use(express.json()); // Middleware для работы с JSON в запросах
// Файл для хранения брендов

var BRANDS_FILE = path.join(__dirname, 'brands.json'); // Маршрут для получения списка брендов

app.get('/brands', function (req, res) {
  fs.readFile(BRANDS_FILE, function (err, data) {
    if (err) {
      res.status(500).send('Error reading brands data');
    } else {
      res.json(JSON.parse(data));
    }
  });
}); // Маршрут для добавления/обновления бренда

app.post('/brands', function (req, res) {
  var newBrand = req.body;
  fs.readFile(BRANDS_FILE, function (err, data) {
    if (err) {
      res.status(500).send('Error reading brands data');
    } else {
      var brands = JSON.parse(data);
      var existingBrandIndex = brands.findIndex(function (b) {
        return b.brandName === newBrand.brandName;
      });

      if (existingBrandIndex >= 0) {
        brands[existingBrandIndex] = newBrand; // Обновляем существующий бренд
      } else {
        brands.push(newBrand); // Добавляем новый бренд
      }

      fs.writeFile(BRANDS_FILE, JSON.stringify(brands, null, 2), function (err) {
        if (err) {
          res.status(500).send('Error saving brand data');
        } else {
          res.send('Brand saved successfully');
        }
      });
    }
  });
});
app.use(function (req, res, next) {
  var regex = /%7B|%7D|{{|}}/;

  if (regex.test(req.url)) {
    // cтандартное изображение
    request("https://fsms.quadcode.com/storage/public/co/j5/n80r041mr5po6k6g/default_logo.png").pipe(res);
  } else {
    next();
  }
});
app.post('/generate-pdf', function _callee(req, res) {
  var browser, page, pdf;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          }));

        case 3:
          browser = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(browser.newPage());

        case 6:
          page = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(page.setContent(req.body, {
            waitUntil: 'networkidle0'
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(page.pdf({
            format: 'A4',
            printBackground: true
          }));

        case 11:
          pdf = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(browser.close());

        case 14:
          res.contentType('application/pdf');
          res.send(pdf);
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error generating PDF: ", _context.t0);
          res.status(500).send("Failed to generate PDF: " + _context.t0.message);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
app.listen(port, function () {
  console.log("Server listening at http://localhost:".concat(port));
});