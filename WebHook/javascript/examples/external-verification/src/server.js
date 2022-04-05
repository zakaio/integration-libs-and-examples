const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/external-verification', function (req, res) {
  // add signature or token verification if necessary
  const body = req.body;
  /*
  body will have format
  {
      protocolVersion: number;
      serviceDid: string;
      subscriberDid: string;
      credentialId: string;
      schemaId: string;
      fields: [{name: string, value: string}];
  }
  */
  console.log(body);
  // add check income data if necessary

  /*
  reply must have format
  {
      ok: boolean;
      extra?: {
          schemaId?: string;
          info: [{name: string, value: string}];
          format?: string;
      };
      errorMessage?: string;
  }
  */
  const accessLevelNV = body.fields.find((nv) => nv.name === 'Access Level');
  const result = {
    ok: accessLevelNV && accessLevelNV.value === 'Super Secret Level',
  };
  if (!result.ok) {
    result.errorMessage = "Access level is invalid";
  }
  res.json(result);
});

//add the router
app.use('/', router);

const port = process.env.PORT || 4606;
app.listen(port);

console.log(`Running at Port ${port}`);
