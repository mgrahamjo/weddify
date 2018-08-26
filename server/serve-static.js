const fs = require('fs');
const path = require('path');

const contentTypes = {
    png: 'image/png',
    ico: 'image/png',
    jpg: 'image/jpg',
    jpeg: 'image/jpg',
    svg: 'image/svg+xml',
    ttf: 'application/octet-stream',
    eot: 'application/octet-stream',
    woff: 'application/octet-stream',
    woff2: 'application/octet-stream',
    css: 'text/css',
    js: 'application/javascript',
    html: 'text/html'
};

const useGzip = process.argv[2] === 'gzipped';

const serve = (req, res) => {

    let url = '.' + req.url;

    if (url.endsWith('/')) {

        url += 'index.html';

    }

    fs.stat(url, (err, stats) => {

        if (err) {

            console.error(err);

            res.writeHead(404);

            return res.end('Not found.');

        }

        if (stats.isDirectory()) {

            url = path.join(url, 'index.html');

        }

        if (!useGzip) {

            console.log(url);

        }

        fs.readFile(url, (_err, file) => {

            if (_err) {

                res.writeHead(500);

                console.error(_err);

                return res.end(_err.toString());

            }

            res.setHeader('Access-Control-Allow-Origin', '*');

            res.setHeader('Access-Control-Allow-Headers', '*');

            res.setHeader('Access-Control-Allow-Methods', '*');

            const ext = path.extname(url).substring(1);

            const contentType = contentTypes[ext];

            if (contentType) {

                res.setHeader('Content-Type', contentType);

            }

            let encoding;

            if (contentType) {

                encoding = 'binary';

            } else {

                file = file.toString();

            }

            res.writeHead(200);

            res.end(file, encoding);

        });

    });

};

module.exports = serve;
