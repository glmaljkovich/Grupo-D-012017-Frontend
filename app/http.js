const axios = require('axios');
const HTTP = axios.create({
  baseURL: 'https://desapp-backend.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Origin': 'http://localhost:80'
  }
});
HTTP.defaults.headers.post.Origin = 'http://localhost:80';
HTTP.defaults.headers.common.Origin = 'http://localhost:80';
HTTP.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

module.exports = HTTP;

// https://desapp-backend.herokuapp.com
