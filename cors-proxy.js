const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy middleware configuration
app.use('/api', createProxyMiddleware({
  target: 'http://192.168.101.11:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove the /api prefix when forwarding the request
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy server is running on http://localhost:${PORT}`);
  console.log(`Proxying requests to http://192.168.50.244:3000`);
});