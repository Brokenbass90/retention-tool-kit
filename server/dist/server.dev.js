"use strict";

var express = require('express');

var puppeteer = require('puppeteer');

var fs = require('fs');

var path = require('path');

var request = require('request');

var app = express();
var port = process.env.PORT || 3001;
var brandsFilePath = path.join(__dirname, 'brands.json');
var templatesFilePath = path.join(__dirname, 'templates.json');
app.use(express["static"]('build'));
app.use(express.json());
app.use(express.text({
  type: 'text/html',
  limit: '50mb'
}));
app.use(function (req, res, next) {
  var regex = /%7B|%7D|{{|}}/;

  if (regex.test(req.url)) {
    request("https://fsms.quadcode.com/storage/public/co/j5/n80r041mr5po6k6g/default_logo.png").pipe(res);
  } else {
    next();
  }
}); // Генерация PDF

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
}); // Эндпоинт для получения всех брендов

app.get('/api/brands', function (req, res) {
  fs.readFile(brandsFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).send('Failed to read brands file');
    }

    try {
      var brands = JSON.parse(data);
      res.json(brands);
    } catch (parseErr) {
      console.error('Error parsing brands.json:', parseErr);
      return res.status(500).send('Failed to parse brands file');
    }
  });
}); // Эндпоинт для добавления нового бренда

app.post('/api/brands', function (req, res) {
  fs.readFile(brandsFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).json({
        error: 'Failed to read brands file'
      });
    }

    var brands = JSON.parse(data);
    brands.push(req.body);
    fs.writeFile(brandsFilePath, JSON.stringify(brands, null, 2), function (err) {
      if (err) {
        console.error('Error writing to brands.json:', err);
        return res.status(500).json({
          error: 'Failed to save brand'
        });
      }

      res.status(201).json({
        message: 'Brand saved successfully'
      });
    });
  });
}); // Эндпоинт для удаления бренда по имени

app["delete"]('/api/brands/:brandName', function (req, res) {
  var brandNameToDelete = req.params.brandName;
  fs.readFile(brandsFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading brands.json:', err);
      return res.status(500).json({
        error: 'Failed to read brands file'
      });
    }

    var brands = JSON.parse(data);
    var initialLength = brands.length;
    brands = brands.filter(function (brand) {
      return brand.brandName !== brandNameToDelete;
    });

    if (brands.length === initialLength) {
      return res.status(404).json({
        error: 'Brand not found'
      });
    }

    fs.writeFile(brandsFilePath, JSON.stringify(brands, null, 2), function (err) {
      if (err) {
        console.error('Error writing to brands.json:', err);
        return res.status(500).json({
          error: 'Failed to delete brand'
        });
      }

      res.status(200).json({
        message: 'Brand deleted successfully'
      });
    });
  });
}); // Новый функционал для работы с шаблонами
// Эндпоинт для получения всех шаблонов

app.get('/api/templates', function (req, res) {
  fs.readFile(templatesFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).send('Failed to read templates file');
    }

    try {
      var templates = JSON.parse(data);
      res.json(templates);
    } catch (parseErr) {
      console.error('Error parsing templates.json:', parseErr);
      return res.status(500).send('Failed to parse templates file');
    }
  });
}); // Эндпоинт для добавления нового шаблона

app.post('/api/templates', function (req, res) {
  fs.readFile(templatesFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).json({
        error: 'Failed to read templates file'
      });
    }

    var templates = JSON.parse(data);
    templates.push(req.body);
    fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2), function (err) {
      if (err) {
        console.error('Error writing to templates.json:', err);
        return res.status(500).json({
          error: 'Failed to save template'
        });
      }

      res.status(201).json({
        message: 'Template saved successfully'
      });
    });
  });
}); // Эндпоинт для удаления шаблона по имени

app["delete"]('/api/templates/:templateName', function (req, res) {
  var templateNameToDelete = req.params.templateName;
  fs.readFile(templatesFilePath, 'utf8', function (err, data) {
    if (err) {
      console.error('Error reading templates.json:', err);
      return res.status(500).json({
        error: 'Failed to read templates file'
      });
    }

    var templates = JSON.parse(data);
    var initialLength = templates.length;
    templates = templates.filter(function (template) {
      return template.name !== templateNameToDelete;
    });

    if (templates.length === initialLength) {
      return res.status(404).json({
        error: 'Template not found'
      });
    }

    fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2), function (err) {
      if (err) {
        console.error('Error writing to templates.json:', err);
        return res.status(500).json({
          error: 'Failed to delete template'
        });
      }

      res.status(200).json({
        message: 'Template deleted successfully'
      });
    });
  });
});
app.listen(port, function () {
  console.log("Server listening at http://localhost:".concat(port));
});