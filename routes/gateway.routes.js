const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();
const { protect } = require('@middleware/auth/auth.middleware');

router.post(
  '/test',
  protect,
  createProxyMiddleware({
    target: 'https://webhook.site/5da6610c-0275-4aa8-b214-386965ae11a3',
    changeOrigin: true,
    pathRewrite: {
      '^/test': '',
    },
  })
);

module.exports = router;
