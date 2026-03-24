import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import https from 'node:https';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const backendBaseUrl = 'https://localhost:7205';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('/api', express.json());

// Forward local API calls to the ASP.NET backend so the frontend always gets JSON,
// not the Angular HTML shell.
app.use('/api/{*splat}', (req, res) => {
  const targetUrl = new URL(req.originalUrl, backendBaseUrl);
  const requestBody =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body);

  const proxyRequest = https.request(
    targetUrl,
    {
      method: req.method,
      rejectUnauthorized: false,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    (proxyResponse) => {
      res.status(proxyResponse.statusCode ?? 500);

      Object.entries(proxyResponse.headers).forEach(([key, value]) => {
        if (value && !['content-length', 'transfer-encoding', 'content-encoding'].includes(key)) {
          res.setHeader(key, value);
        }
      });

      proxyResponse.pipe(res);
    },
  );

  proxyRequest.on('error', (error) => {
    res.status(502).json({
      message: 'Unable to reach backend API.',
      details: error.message,
    });
  });

  if (requestBody) {
    proxyRequest.write(requestBody);
  }

  proxyRequest.end();
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
