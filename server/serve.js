const http = require('http');
const serveStatic = require('./serve-static');

const wrapSend = res => (status = 404, response = {}) => {

    if (status >= 400) {

        console.error(status, response);

    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Access-Control-Allow-Methods', '*');

    try {

        response = JSON.stringify(response);

        res.setHeader('Content-Type', 'application/json');

    } catch (e) {

        response = response.toString();

    }

    res.writeHead(status);

    res.end(response, 'utf8');

};

function serve(routes) {

    const server = http.createServer((req, res) => {

        const send = wrapSend(res);

        const pathParts = req.url.split('/');

        const route = pathParts[1];

        if (routes[route]) {

            return routes[route](send, pathParts[2], res);

        }

        return serveStatic(req, res);

    });

    server.listen(8000);

    console.log('listening on 8000');

}

module.exports = serve;
