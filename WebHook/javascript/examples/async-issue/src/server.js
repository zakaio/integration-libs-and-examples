const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require('axios');

function dateToSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}
let counter = 1;

const keyString = '';

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
      credentialId: "2RjEBo9zXkJByXm14xQHtg:3:CL:568:tag",
      schemaId: "2RjEBo9zXkJByXm14xQHtg:2:My Schema:1.0",
      fields: [
        {name: "Document ID", value: "007"},
        {name: "Counter", value: `${counter++}`},
        {name: "Access Level", value: "Super Secret Level"},
        {name: "Credential Issue Date", value: `${dateToSeconds(new Date())}`},
      ],
    }];
    const result = {
      serviceDid: body.publicServiceDid,
      subscriberConnectDid: body.subscriberConnectDid,
      actionEventId: body.actionEventId,
      issuedCredentials: issuedCredentials,
      revokedCredentials: [],
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
