const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require('axios');

function dateToSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}
let counter = 1;

const keyString = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

function sendResult(url, result) {
  const binaryBody = Buffer.from(JSON.stringify(result),"utf-8");
  const headers = {
    'Content-Type': 'application/json'
  };

  const key = crypto.createPrivateKey({ key: keyString });
  const signature = crypto.sign('sha3-256', binaryBody, key);
  headers['X-Body-Signature'] = signature.toString('base64');
  axios.post(
      url,
      binaryBody,
      {
        headers: headers
      }
  ).then((reply) => {
    console.log(reply);
  }).catch((err) => {
    console.log(err);
  });

}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/async-issue', function (req, res) {
  // add signature or token verification if necessary
  const body = req.body;
  /*
  body will have format
  {
      containerPrefix?: string;
      publicServiceDid: string;
      subscriberConnectDid: string;
      actionId: string;
      actionInstanceId: string;
      actionEventId: string;
      actionParams: [{
        name: string;
        value: string;
      }];
      receivedCredentials: [{
        credentialId: string;
        schemaId: string;
        fields: [{
          name: string;
          value: string;
        }];
        utcIssuedAt: number; // utc
        revoked: boolean; //
        utcRevokedAt?: number; //
    }];
  }
  */
  console.log(body);
  // add check income data if necessary

  /*
  issued credential has format
  {
    credentialId: string;
    schemaId: string;
    fields: [{
      name: string;
      value: string;
    }];
    utcIssuedAt: number; // utc
    revoked: boolean; //
    utcRevokedAt?: number; //
  }
   */
  setTimeout(() => {
    const issuedCredentials = [{
      credentialId: "FhnK3hGQ6EeQHKztiHJ6pu:3:CL:649:tag",
      schemaId: "FhnK3hGQ6EeQHKztiHJ6pu:2:Example Secret Access:1.0",
      fields: [
        {name: "Document ID", value: "007"},
        {name: "Counter", value: `${counter++}`},
        {name: "Access Level", value: "Super Secret Level"},
        {name: "Credential Issue Date", value: `${dateToSeconds(new Date())}`},
      ],
      utcIssuedAt: new Date().getTime(),
      revoked: false
    }];
    const result = {
      serviceDid: body.publicServiceDid,
      subscriberConnectDid: body.subscriberConnectDid,
      subscriberEventId: body.actionEventId,
      issuedCredentials: issuedCredentials,
      revokedCredentials: [],
      issuedAt: new Date().getTime(),
      ok: true
    };
    sendResult(
        `https://platform.proofspace.id/service-dashboard-backend/service/${body.publicServiceDid}/webhook-accept/credentials-issued`,
        result
    );
  },20000);
  const emptyResult = {
    serviceDid: body.publicServiceDid,
    subscriberConnectDid: body.subscriberConnectDid,
    actionEventId: body.actionEventId,
    issuedCredentials: [],
    revokedCredentials: [],
    ok: true
  };
  res.json(emptyResult);
});

//add the router
app.use('/', router);

const port = process.env.port || 4604;
app.listen(port);

console.log(`Running at Port ${port}`);
