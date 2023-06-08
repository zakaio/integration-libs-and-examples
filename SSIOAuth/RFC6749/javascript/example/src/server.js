const express = require('express');
const app = express();
const path = require('path');
const { expressjwt: jwt } = require('express-jwt');
const router = express.Router();
const axios = require('axios');
const queryString = require('query-string');
const fs = require('fs')


const JWT_KEY = fs.readfilesync(process.env.JWT_KEY_FILE)
const JWT_ALGO = fs.readfilesync(process.env.JWT_ALGO)
console.log("JWT_KEY="+JWT_KEY)

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/secret/index.html'));
});

router.get('/redirect',function(req,res){
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const code = req.query.code;
  const redirectUri = process.env.REDIRECT_URI || (req.protocol + '://' + req.get('host') + req.originalUrl.split("?").shift());
  axios.post(
      `${process.env.OAUTH_URL}/token`,
      queryString.stringify({
        'client_id': clientId,
        'client_secret': clientSecret,
        'code': code,
        'redirect_uri': redirectUri,
        'grant_type': 'authorization_code'
      })
  ).then((response) => {
      const token = response.data['access_token'];
      res.cookie('zakaAuth', token);
      res.redirect(302, process.env.ROOT_URI);
  }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
  });
});

router.get('/secret', jwt({ secret: JWT_KEY, algorithms: [JWT_ALGO]}), function(req,res) {
  console.log(req.user);
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
});

//add the router
app.use('/', router);

const port = process.env.PORT || 4607;

app.listen(port);

console.log(`Running at Port ${port}`);
