const nunjucks = require('nunjucks');
const express = require('express');
const routes = require('./app/routes');

const app = express();
const port = (process.env.PORT || 1045);

const https = require('https')

nunjucks.configure(
  [
    'src/app',
    'app/views',
    'app/views/layouts',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/',
    'dist/campaign/components/'
  ], {
  express: app,
  autoescape: true,
  watch: true,
  noCache: true,
});


app.set('view engine', 'html');


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:4737');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

app.use(express.static('dist'));

routes.bind(app);

const httpsOptions = {
  cert: '-----BEGIN CERTIFICATE-----\n' +
    'MIIDIDCCAgigAwIBAgIJAO6QWNF0HgLqMA0GCSqGSIb3DQEBBQUAMBQxEjAQBgNV\n' +
    'BAMTCWxvY2FsaG9zdDAeFw0xNzA5MTMxNTIyMzFaFw0yNzA5MTExNTIyMzFaMBQx\n' +
    'EjAQBgNVBAMTCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\n' +
    'ggEBAMfpW7xYfnincIaiSzoKAEEZJOmm6rOhjjE4vH6pZMttRsE15foKHVC7VL/P\n' +
    '/R0xCKiUXApQptVVrPAjcilRWAdbqai1Xn9RY5fGtbYHhWq6OgBzEdMpxiOGA57P\n' +
    'lX9VSwYp5pQH3PDb6itVx4oWC2ttRSNobP1quItcn/nWXT4TGMwkxP8+NZwPwhuw\n' +
    'DCGXymiIq8cX0wy1tnqQIhJuMkzy94XCSPUSlUKYZaAP0joHvx/m0ZQ/P3DGSFKJ\n' +
    'LMBjMoOTrbj3eksXvavDS5Zp/Grc44/nhTvGxI05djizhgqT0bCVjeV88qbmGj4e\n' +
    'cQphme+o4bhRX0VVG3Vq0M0ZGjECAwEAAaN1MHMwHQYDVR0OBBYEFJqgXGTBm2EG\n' +
    'iM1+NBo9yZbxYj+FMEQGA1UdIwQ9MDuAFJqgXGTBm2EGiM1+NBo9yZbxYj+FoRik\n' +
    'FjAUMRIwEAYDVQQDEwlsb2NhbGhvc3SCCQDukFjRdB4C6jAMBgNVHRMEBTADAQH/\n' +
    'MA0GCSqGSIb3DQEBBQUAA4IBAQBhBq4OTGfBtsmt81sOMPhyg1D6C/JUWhfe09X3\n' +
    'COEROVhcMvSgGeN0ykLkgo/3OYVFOd+IFyCcTSTYEdJ9dLdWZhxZeCSPoAxw56uV\n' +
    'mUoYMJW6FU2sqOwEXtvPaIyMH6FeGV++vOk0lg1BGcJ8XLiJEsVcokS6BAL5uSmb\n' +
    'RRJLrfmbJf+xIWc1useoX0avWWLsUo0TQePcLaBaZsDb6HkV+5/8R5daLvvh58uv\n' +
    '5hR0T40KN0bBRpDNJapQBMJeIObAFb3Yy6ck9OicFq3BN5eO51rxUxuH7WGODz0w\n' +
    'PCsIshlf1FpkFHunm3/e9JmnpJwZxkI6sFzhLX10QMYqkVMB\n' +
    '-----END CERTIFICATE-----',
  key: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEAx+lbvFh+eKdwhqJLOgoAQRkk6abqs6GOMTi8fqlky21GwTXl\n' +
    '+godULtUv8/9HTEIqJRcClCm1VWs8CNyKVFYB1upqLVef1Fjl8a1tgeFaro6AHMR\n' +
    '0ynGI4YDns+Vf1VLBinmlAfc8NvqK1XHihYLa21FI2hs/Wq4i1yf+dZdPhMYzCTE\n' +
    '/z41nA/CG7AMIZfKaIirxxfTDLW2epAiEm4yTPL3hcJI9RKVQphloA/SOge/H+bR\n' +
    'lD8/cMZIUokswGMyg5OtuPd6Sxe9q8NLlmn8atzjj+eFO8bEjTl2OLOGCpPRsJWN\n' +
    '5XzypuYaPh5xCmGZ76jhuFFfRVUbdWrQzRkaMQIDAQABAoIBAEiDYP8kqlthgPOV\n' +
    'EuxujEEQuc72+NNHmqhICDd5glI3xR54Sn80BAYwrUEWVJ2uF5HunqQvNRTVCvHg\n' +
    'KZzLIL8qhJPplelgwFthfLAWclKQUlGva5vI31IrXkzQx010xs3pjPXNFFtZqcsm\n' +
    'RkbUUDgbXqTFUCNr/pyucGjTVOcaqRYuPILuvElItO/TDNdt9Wehu2VGNgRbQxqK\n' +
    'hQCMmeO6PiHD2xWfCCcAuhc8A0g8CLsQ2Lkz92I4IJ/+6woi8W4vFSSkgMmUP76h\n' +
    'FEjB3DxRZC3E/iouy+EgBRi7G0NrGp52fJ5vlDw9pLj7K/2eJeYNsr2VKZKBXH/C\n' +
    'Ywx46AECgYEA/NF6TZE8ZWnaqvujmb2bWpvpkAurIW1p0lPc3CpU916Ah9qgvuVN\n' +
    '1RzhIBX8ShTVd1fXD2hiAYomeX5cNT8tTqAmykmo5960ban7tOr3B7q8nIwGdA8E\n' +
    'lqm1xEw1o/BJtG5mMAJn8M4l5uVP6kbT+ce234XeTCCpK2iI8Bss4lECgYEAym1t\n' +
    'ZiTJQ1Z3ckSexLmXPhKWB6BbClS342ZDR9rmat8RR7GoOnwJ3kdOPagp53g2BIGz\n' +
    'nxXjWi2eWxUjli9YT/8pIyWhIg8eE0gzKSaqg1T1wZM5HWrSDVL+9Euv7/0wExNk\n' +
    'iEOG3wAPD+kGpNKFRisYH0fyB00Lk679KFet4eECgYEA3NefnmJf/7aX7QQjxQh7\n' +
    'zIqlW87Vjj2lUrUvGKNh1TQX0pSIFjj35FF11jFeUNgiID36/tqPwgiL01Ut9tVZ\n' +
    'HnWHbO0rPmCr+5+g4EjfwUC9wYIPoRH9UB6vSOnJcYtU1ugZG5b+dLufIDLvvBZi\n' +
    '1K5AcMDfjmB5ZhHKjPMwIgECgYAh7g+dRGM71z10OM5H+TfBnsnpA1bfN24PPq/e\n' +
    'VnGyzisOUlf5XZsl19vkd9B2TO74+GiMLNYL4oOdjsCFRvBNkF5r1r3YgKIw5zQ0\n' +
    'HJgOJWqABNZY+PO2agf0GM+nsU+ikuiR8oejz1W2+/8yF1thdI25iIyn7qEXIwip\n' +
    '/3BU4QKBgQD7F0IAoxaRLYFHPTnftStNBaz7bt9BU24XDTbfqm5TeaQAr3Y9jWmX\n' +
    'yfAzaIkFmajsiKoNO3BCbMcTf+Fwr9uzPw3x77PU0qTGdCjREh/C5pcMSsxJ7w7O\n' +
    '84ia41EpemNmYgnvCx7rQwTZkvPuDBdgjuTMzPsL53AVJVv5WGmQAA==\n' +
    '-----END RSA PRIVATE KEY-----',
  requestCert: false,
  rejectUnauthorized: false,
}

//if (process.env.settings === 'dev') {
  const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('Website running at https://localhost:' + port);
   })
// } else {
//   app.listen(port);
//   console.log('');
//   console.log(`Listening on port ${port}`);
//   console.log('');
// }

