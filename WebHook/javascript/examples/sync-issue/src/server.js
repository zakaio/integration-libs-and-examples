const crypto = require('crypto')
const express = require('express');
const fs = require(fs);

const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

function dateToSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}
let counter = 1;


const publicKey = crypto.createPublicKey(fs.readFileSync('publicKey.pem'));

function throwForbiddenError(message) {
   const error = new Error(message)
   error.status = 403
   throw error
}

function signatureChecker(req, resp, buff, encoding) {
  const signature = req.header("X-Body-Signature");
  if (!signature) {
      throw throwForbiddenError("X-Body-Signature header is absent");
  }
  const v = crypto.verify("sha3-256",buff,publicKey,Buffer.from(signature,'base64'));
  if (!v) {
    throw throwForbiddenError("Invalid Body Signature");
  }
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json( { verify: signatureChecker } ));

router.post('/sync-issue', function (req, res) {
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
    credentialId: process.env.CREDENTIAL_ID,
    schemaId: process.env.SCHEMA_ID,
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

const port = process.env.PORT || 4605;
app.listen(port);

console.log(`Running at Port ${port}`);
