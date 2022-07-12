const express = require('express');
const { IPFS_API_KEY } = require('../constants');

const apiKeysRoutes = express.Router();

apiKeysRoutes.get('/ipfs', (_, res) => {
  const apiKey = IPFS_API_KEY;

  console.log(apiKey)
  res.json({ key: IPFS_API_KEY });
});

module.exports = apiKeysRoutes;
