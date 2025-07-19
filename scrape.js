const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 8080;

console.log('Iniciando scraper simple...');

// Ruta raíz para health check
app.get('/', (req, res) => {
    res.send('Servidor funcionando 🚀');
});

// Endpoint GET /scrape?url=https://...
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL es requerido');

    try {
        // Obtener HTML de la página
        const response = await axios.get(url, { timeout: 15000 });
        const html = response.data;

        // Cargar HTML en cheerio para parsear y manipular
        const $ = cheerio.load(html);

        // Ejemplo: extraer el título de la página
        const title = $('title').text();

        // Podés modificar para extraer lo que necesites:
        // const textoImportante = $('selector').text();

        // Enviar resultado
        res.json({
            url,
            title,
            // textoImportante
        });
    } catch (error) {
        console.error('Error en scraper con axios:', error.message);
        res.status(500).send('Error en el scraper');
    }
});

app.listen(port, () => {
    console.log(`Scraper escuchando en puerto ${port}`);
});
