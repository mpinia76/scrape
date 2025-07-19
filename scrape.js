const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

console.log('Iniciando scraper...');

// 🟢 Ruta raíz para health check
app.get('/', (req, res) => {
    res.send('Servidor funcionando 🚀');
});

// Endpoint GET /scrape?url=https://...
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL es requerido');

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // ⏱️ Timeout agregado para evitar que se cuelgue si la página no carga
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

        await new Promise(resolve => setTimeout(resolve, 2000));

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error('Error en Puppeteer:', error);
        res.status(500).send('Error en el scraper');
    }
});

app.listen(port, () => {
    console.log(`Scraper escuchando en puerto ${port}`);
});
