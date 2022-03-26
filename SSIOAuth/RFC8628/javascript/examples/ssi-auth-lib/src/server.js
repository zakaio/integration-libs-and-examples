const express = require('express');
const app = express();
const path = require('path');
const jwt = require('express-jwt');
const router = express.Router();

const JWT_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq8U5sv8XOhi2Q1xXV2B5
XzGlbjSpRrI6eeMfAQ/hDRkki6ToImjlO21qUhiFY9dk5SfeU7YfAuRTrL6cDSPL
iU0TzzB3PALmDT1J8EjPI+S3Ztx+Ds8xPBhqZ8miaag9NQkjTeJor0obvzfnHwI0
j3BB25YSsEpYxrsXTbCoOwBm3c5KDMdJr6ZBZDG1zyqwS2dRQDlR+cXFDqRekoYo
280IYv1V7x3EetRLcXr6HLbixxHEXLUsJ2wv3/dBfv9ame6tOjKDdGqN0SgPljnA
fHyQkXoOELX/GOixzPRs29StF15Rimf5jFZXawY6ZDVue39z6tQBbHALzNhReoCL
kQIDAQAB
-----END PUBLIC KEY-----`;
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/secret/index.html'));
});

router.get('/auth',function(req,res){
  res.sendFile(path.join(__dirname+'/auth/index.html'));
});

router.get('/auth/ssi.js',function(req,res){
  res.sendFile(path.join(__dirname+'/auth/ssi.js'));
});

router.get('/secret', jwt({ secret: JWT_KEY, algorithms: ['RS256']}), function(req,res) {
  console.log(req.user);
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
});

//add the router
app.use('/', router);
app.listen(process.env.port || 4603);

console.log('Running at Port 4603');
