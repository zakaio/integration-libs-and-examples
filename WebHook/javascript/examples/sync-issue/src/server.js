const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

function dateToSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}
let counter = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/sync-issue', function (req, res) {
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
    actionEventId: body.actionEventId,
    issuedCredentials,
    revokedCredentials: [],
    ok: true
  };
  res.json(result);
});

//add the router
app.use('/', router);

const port = process.env.port || 4605;
app.listen(port);

console.log(`Running at Port ${port}`);
