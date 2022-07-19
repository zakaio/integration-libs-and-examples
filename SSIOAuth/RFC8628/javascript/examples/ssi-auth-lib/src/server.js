const express = require('express');
const app = express();
const path = require('path');
const jwt = require('express-jwt');
const router = express.Router();

const JWT_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`;
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/secret/index.html'));
});

router.get('/auth',function(req,res){
  res.sendFile(path.join(__dirname+'/auth/index.html'));
});

router.get('/auth/wl.js',function(req,res){
  res.sendFile(path.join(__dirname+'/auth/wl.js'));
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

const port = process.env.PORT || 4603;

app.listen(port);

console.log(`Running at Port ${port}`);
