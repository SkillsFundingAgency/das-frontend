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
app.use('/dist', express.static('dist'));

routes.bind(app);

const httpsOptions = {
  key: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEoAIBAAKCAQEAsSAgarJjK4aBKweMeCiU9bTVCdqeZPwqc/fLUeB1OpZLyt43\n' +
    'kGwQTXcdjsCandw61yP6fZwYMW5F0Mm0WA514UWpY/4sTK88wG26SXHcGSOOOfaE\n' +
    'Ct8OcDCziRipGRz4FUYjG/CfHWWV4BpVzZiop+AyghHrMc1ejXCsDC7+J7stdcvr\n' +
    'e8oQNFhST2qTno7XjYGhLf2I7kBlky4LYjo9l0JQxih0mQ4MFptM3tUmSdgNdTpp\n' +
    'EjCwcadBAt172wnoMSbOHUI+5Rs3/BPEhTO4n2U2LO0S2l2C+DzPVe4YSYHngxZ6\n' +
    '1QzfAFk1gJZgHpJ43GFrwK1hBJHrxG5B3Eq4tQIDAQABAoIBAHdmIrQKAFPM3bG1\n' +
    '6vjs0k03UwzLdE66tZtrBIHy/tM5kWn1lhsi3XJ6w1ABgbi8RmXUePzHhn97yFBQ\n' +
    'R+O8C7aJkQA4zH/8+MT2ssbjm+zOTQfBp4z0g/UYv03Bc+vb3Vfp6azh7UCRxBBH\n' +
    'cGOhbr+LoECR96ugtwY9V5z26Ji6shHWhJkx+gDhFRQc5VhqyKLXmgvXN1aTXtFN\n' +
    'zrUQHHQ3OuRuXbhWOIx15whU0dOLoCyhgu2WZ1nqOXJwItTe+i2DkPmEFOsO+5Cl\n' +
    'rTEDPZocfpj0ruZV+Xpe979UJxv2soTyEBIpprTitdLl7DIPCyz/0JxJYrmtIoPs\n' +
    '2jX7u5kCgYEA6xQavRMHOv/67VhFf7RTo52mmndc3wiyVZ7AVJFuBoQ3gLp2QbbP\n' +
    'a5di5ChCXGor7zbEHVVVqriaX23YBMe5f5+NKso+fhA6+EaKChoduqUnHqPOBXfK\n' +
    'Ul8qsKbZHrYYTNQ7beY1LC8Z5YqR7UnCSXXkCL4HI35ZZMCapaa918sCgYEAwOOn\n' +
    'M0Faf1VIw+8r4kr00FnIMyOblKSOmVUjn110WLSFMO+Jt0E1jBh0Lc1wtu80lfwp\n' +
    'Ftwyh3Epyf5iO0eMikqR2NaVehI4O4oAL2j8V00nMtf3/Cg9c7Lyj58loF71q//x\n' +
    'oe0PNQKuCLv9hfc0ICvpK9IW6EoDp7PlyxVyoX8Cf3Z0qwSbkgko9EilMmAnff30\n' +
    'cv9jJmk8+KAsXr4+ijK+bTlwvCZg+CQ/JJXTs5zd40WnUyt01LYyT5fGwhOmkNK+\n' +
    'k2P8hYEArLZu1SBCCLkEf7Hw2N/ofQsE6X4alU3kdFpCl6/JUQHyuhnwuZfYkw5x\n' +
    'WXcOSoqYIHOkmkjevMsCgYAQ72vsqh5B88Dxwvv9YEtiR5+2LbgpMtF6UOlRwqjG\n' +
    'aQMQqtdSiZ0j8bmxk8oDpbjeOkd5RFgDYEIlA/qn7b4/HhD0EtMI5rSdNZ6Siwss\n' +
    'tw9r/V4+e2H52IpHZdet3uh+83fJmcCuDNAu4CKAMpYXBQPx3v434tezT64rSHTK\n' +
    'DQKBgF2TFIrXLGX2ST+lW2OFqf8F1rRW3aCCecHTsPApIEMj23OYbovbFhZREC1W\n' +
    'qM1ziFd6RaFJl/xryWeOpGILVMxnBZSSlPAUX6yr5m0UoTsxTQcNtcyJkxfbkpWX\n' +
    'Dcpk5de4I4vQvxQJR/V20Qa+Vdfu8mOpLg/sC1SEuBQ5NLx1\n' +
    '-----END RSA PRIVATE KEY-----\n',
  cert: '-----BEGIN CERTIFICATE-----\n' +
    'MIIDmDCCAoACCQCOI1xGrHTsjzANBgkqhkiG9w0BAQsFADCBjTELMAkGA1UEBhMC\n' +
    'VUsxETAPBgNVBAgMCFdlc3RNaWRzMREwDwYDVQQHDAhDb3ZlbnRyeTEMMAoGA1UE\n' +
    'CgwDRGZFMQswCQYDVQQLDAJTQTESMBAGA1UEAwwJbG9jYWxob3N0MSkwJwYJKoZI\n' +
    'hvcNAQkBFhpoZWxsb0BqYW1lc21pY2hhZWxraW5nLmNvbTAeFw0xNzExMjgxMzUw\n' +
    'MTNaFw0xODExMjgxMzUwMTNaMIGNMQswCQYDVQQGEwJVSzERMA8GA1UECAwIV2Vz\n' +
    'dE1pZHMxETAPBgNVBAcMCENvdmVudHJ5MQwwCgYDVQQKDANEZkUxCzAJBgNVBAsM\n' +
    'AlNBMRIwEAYDVQQDDAlsb2NhbGhvc3QxKTAnBgkqhkiG9w0BCQEWGmhlbGxvQGph\n' +
    'bWVzbWljaGFlbGtpbmcuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\n' +
    'AQEAsSAgarJjK4aBKweMeCiU9bTVCdqeZPwqc/fLUeB1OpZLyt43kGwQTXcdjsCa\n' +
    'ndw61yP6fZwYMW5F0Mm0WA514UWpY/4sTK88wG26SXHcGSOOOfaECt8OcDCziRip\n' +
    'GRz4FUYjG/CfHWWV4BpVzZiop+AyghHrMc1ejXCsDC7+J7stdcvre8oQNFhST2qT\n' +
    'no7XjYGhLf2I7kBlky4LYjo9l0JQxih0mQ4MFptM3tUmSdgNdTppEjCwcadBAt17\n' +
    '2wnoMSbOHUI+5Rs3/BPEhTO4n2U2LO0S2l2C+DzPVe4YSYHngxZ61QzfAFk1gJZg\n' +
    'HpJ43GFrwK1hBJHrxG5B3Eq4tQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQB7yOj9\n' +
    'GxAIwz7MmB6Ws1JvjntE3hWUyfoTey3Kc2ajhtUW9eVMxokVWNU1/SLvDOXnZHIW\n' +
    '2ifLs+HtiOOY0I67sY42nfVTeSDFpGijBfnadIMMJYUBpikqk+2ygWKfq02K5K0Q\n' +
    'nqdqACfIsDH5H++BsuL7u4divaIpOhHTg2q7wxEkeR+PdAfObeNX/UzxedKKVCFP\n' +
    'C7NTy/1ncfjgC6f3wvcYYOE9AwTE4j2wrrb3i58nGbW5lRLOq9gKsETdPS4h0A8h\n' +
    'wuNpoABahjZvmffo4cPmptXoJUNp6YjE+lLg/Q8YXI4nnaDvHX7IKWFM9ucTVZT/\n' +
    'CeLsKR7U2uGbEasI\n' +
    '-----END CERTIFICATE-----\n'
}

if (process.env.settings === 'dev') {
  const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('Website running at https://localhost:' + port);
  })
} else {
  app.listen(port);
  console.log('');
  console.log(`Listening on port ${port}`);
  console.log('');
}

