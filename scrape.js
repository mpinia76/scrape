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
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': url
            }
        });

        const html = response.data;

        // Cargar HTML en cheerio para parsear y manipular
        const $ = cheerio.load(html);

        // Ejemplo: extraer el título de la página
        const title = $('title').text();

        // Podés modificar para extraer lo que necesites:
        // const textoImportante = $('selector').text();

        // Enviar resultado
        /*res.json({
            url,
            title,
            // textoImportante
        });*/
        // ✅ Enviar el HTML completo sin parsear
        res.send(html);
    } catch (error) {
        console.error('Error en scraper con axios:', error.message);
        res.status(500).send('Error en el scraper');
    }
});

app.listen(port, () => {
    console.log(`Scraper escuchando en puerto ${port}`);
});
